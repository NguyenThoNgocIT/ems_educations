package com.quanlydaotao.backend.course.service.impl;

import com.quanlydaotao.backend.common.exception.BusinessException;
import com.quanlydaotao.backend.common.exception.ResourceNotFoundException;
import com.quanlydaotao.backend.course.dto.CourseRegistrationResponse;
import com.quanlydaotao.backend.course.dto.RetakeImprovementOptionResponse;
import com.quanlydaotao.backend.course.dto.RetakeImprovementRegistrationRequest;
import com.quanlydaotao.backend.course.entity.CourseClass;
import com.quanlydaotao.backend.course.entity.CourseRegistration;
import com.quanlydaotao.backend.course.mapper.CourseRegistrationMapper;
import com.quanlydaotao.backend.course.repository.CourseClassRepository;
import com.quanlydaotao.backend.course.repository.CourseRegistrationRepository;
import com.quanlydaotao.backend.course.service.RegistrationService;
import com.quanlydaotao.backend.grade.entity.StudentSummary;
import com.quanlydaotao.backend.grade.repository.StudentSummaryRepository;
import com.quanlydaotao.backend.registrationperiod.entity.RegistrationPeriod;
import com.quanlydaotao.backend.registrationperiod.repository.RegistrationPeriodRepository;
import com.quanlydaotao.backend.scheduling.entity.Schedule;
import com.quanlydaotao.backend.scheduling.repository.ScheduleRepository;
import com.quanlydaotao.backend.student.entity.Student;
import com.quanlydaotao.backend.student.repository.StudentRepository;
import com.quanlydaotao.backend.trainingprogramcourse.repository.TrainingProgramCourseRepository;
import com.quanlydaotao.backend.user.entity.User;
import com.quanlydaotao.backend.user.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;
import java.util.Set;
import java.util.UUID;
import java.util.function.Function;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class RegistrationServiceImpl implements RegistrationService {
    private static final int STATUS_CONFIRMED = 1;
    private static final int REGISTRATION_TYPE_RETAKE = 1;
    private static final int REGISTRATION_TYPE_IMPROVE = 2;
    private static final double PASSING_GRADE = 4.0D;

    private final CourseRegistrationRepository registrationRepository;
    private final CourseClassRepository courseClassRepository;
    private final StudentSummaryRepository summaryRepository;
    private final StudentRepository studentRepository;
    private final RegistrationPeriodRepository registrationPeriodRepository;
    private final TrainingProgramCourseRepository trainingProgramCourseRepository;
    private final ScheduleRepository scheduleRepository;
    private final UserRepository userRepository;
    private final CourseRegistrationMapper registrationMapper;

    @Override
    @Transactional
    public CourseRegistrationResponse registerCourse(UUID studentId, UUID courseClassId) {
        Student student = studentRepository.findById(studentId)
                .orElseThrow(() -> new ResourceNotFoundException("Không tìm thấy sinh viên"));
        CourseClass courseClass = requireCourseClass(courseClassId);
        if (!Boolean.TRUE.equals(courseClass.getIsActive())) {
            throw new BusinessException("Lớp học phần không còn hoạt động");
        }

        RegistrationPeriod period = registrationPeriodRepository.findActivePeriod(courseClass.getSemesterId(), LocalDateTime.now())
                .orElseThrow(() -> new BusinessException("Hiện không có đợt đăng ký học lại/cải thiện hợp lệ"));

        if (registrationRepository.existsByStudentIdAndCourseClassIdAndIsActiveTrue(studentId, courseClassId)) {
            throw new BusinessException("Sinh viên đã đăng ký lớp học phần này");
        }
        if (isFull(courseClass)) {
            throw new BusinessException("Lớp học phần đã đầy sinh viên");
        }

        UUID courseId = courseClass.getCourseId();
        validateCourseBelongsToTrainingProgram(student, courseId);
        validateDuplicateCourseInSemester(studentId, courseClass);
        validateScheduleConflict(studentId, courseClass);
        StudentSummary previousSummary = requirePreviousSummaryForRetakeOrImprove(studentId, courseId);
        int registrationType = resolveRetakeOrImproveType(previousSummary);

        CourseRegistration registration = CourseRegistration.builder()
                .studentId(studentId)
                .courseClassId(courseClassId)
                .registrationPeriodId(period.getRegistrationPeriodId())
                .registrationType(registrationType)
                .replacedGradeId(previousSummary.getCourseRegistrationId())
                .registeredAt(LocalDateTime.now())
                .status(STATUS_CONFIRMED)
                .isPaid(false)
                .build();
        registration.setIsActive(true);

        courseClass.setCurrentStudent((courseClass.getCurrentStudent() == null ? 0 : courseClass.getCurrentStudent()) + 1);
        courseClassRepository.save(courseClass);

        return registrationMapper.toDto(registrationRepository.save(registration));
    }

    @Override
    @Transactional(readOnly = true)
    public List<RetakeImprovementOptionResponse> getCurrentStudentRetakeImprovementOptions(String username, UUID semesterId) {
        Student student = requireCurrentStudent(username);
        Map<UUID, StudentSummary> summariesByCourse = latestFinalizedSummariesByCourse(student.getStudentId());
        if (summariesByCourse.isEmpty()) {
            return List.of();
        }

        List<RegistrationPeriod> activePeriods = registrationPeriodRepository.findActiveRetakePeriods(semesterId, LocalDateTime.now());
        if (activePeriods.isEmpty()) {
            return List.of();
        }

        List<UUID> semesterIds = activePeriods.stream()
                .map(RegistrationPeriod::getSemesterId)
                .distinct()
                .toList();
        List<UUID> courseIds = summariesByCourse.keySet().stream().toList();
        return courseClassRepository.findBySemesterIdInAndCourseIdInAndIsActiveTrue(semesterIds, courseIds).stream()
                .map(courseClass -> toRetakeImprovementOption(student, courseClass, summariesByCourse.get(courseClass.getCourseId())))
                .toList();
    }

    @Override
    @Transactional
    public CourseRegistrationResponse registerCurrentStudentRetakeImprovement(
            String username,
            RetakeImprovementRegistrationRequest request) {
        Student student = requireCurrentStudent(username);
        return registerCourse(student.getStudentId(), request.getCourseClassId());
    }

    private StudentSummary requirePreviousSummaryForRetakeOrImprove(UUID studentId, UUID courseId) {
        return summaryRepository.findLatestFinalizedByStudentAndCourse(studentId, courseId)
                .orElseThrow(() -> new BusinessException(
                        "Đăng ký học phần chỉ áp dụng cho học lại hoặc học cải thiện; học phần lần đầu do admin/phòng đào tạo gán theo chương trình đào tạo"));
    }

    private int resolveRetakeOrImproveType(StudentSummary previousSummary) {
        if (isFailed(previousSummary)) {
            return REGISTRATION_TYPE_RETAKE;
        }
        if (isPassed(previousSummary)) {
            return REGISTRATION_TYPE_IMPROVE;
        }
        throw new BusinessException("Học phần chưa có kết quả cuối cùng nên chưa thể đăng ký học lại hoặc học cải thiện");
    }

    private boolean isFailed(StudentSummary summary) {
        return "FAILED".equalsIgnoreCase(summary.getResult())
                || (summary.getTotalScore() != null && summary.getTotalScore().doubleValue() < PASSING_GRADE);
    }

    private boolean isPassed(StudentSummary summary) {
        return "PASSED".equalsIgnoreCase(summary.getResult())
                || (summary.getTotalScore() != null && summary.getTotalScore().doubleValue() >= PASSING_GRADE);
    }

    private String registrationTypeName(int registrationType) {
        return switch (registrationType) {
            case REGISTRATION_TYPE_RETAKE -> "Học lại";
            case REGISTRATION_TYPE_IMPROVE -> "Học cải thiện";
            default -> "Không xác định";
        };
    }

    private void validateCourseBelongsToTrainingProgram(Student student, UUID courseId) {
        if (student.getTrainingProgramId() == null) {
            throw new BusinessException("Sinh viên chưa được gán chương trình đào tạo để đăng ký học lại/cải thiện");
        }
        if (!trainingProgramCourseRepository.existsByTrainingProgramIdAndCourseIdAndIsActiveTrue(student.getTrainingProgramId(), courseId)) {
            throw new BusinessException("Học phần không thuộc chương trình đào tạo hiện tại của sinh viên");
        }
    }

    private void validateDuplicateCourseInSemester(UUID studentId, CourseClass courseClass) {
        Set<UUID> sameCourseClassIds = courseClassRepository.findBySemesterIdAndCourseId(courseClass.getSemesterId(), courseClass.getCourseId())
                .stream()
                .map(CourseClass::getCourseClassId)
                .collect(Collectors.toSet());
        boolean registeredSameCourse = registrationRepository.findByStudentIdAndIsActiveTrue(studentId).stream()
                .anyMatch(registration -> sameCourseClassIds.contains(registration.getCourseClassId()));
        if (registeredSameCourse) {
            throw new BusinessException("Sinh viên đã đăng ký học lại/cải thiện học phần này trong học kỳ");
        }
    }

    private void validateScheduleConflict(UUID studentId, CourseClass targetCourseClass) {
        List<Schedule> targetSchedules = scheduleRepository.findByCourseClassCourseClassId(targetCourseClass.getCourseClassId());
        if (targetSchedules.isEmpty()) {
            return;
        }
        List<CourseRegistration> activeRegistrations = registrationRepository.findByStudentIdAndIsActiveTrue(studentId);
        for (CourseRegistration registration : activeRegistrations) {
            if (registration.getCourseClassId().equals(targetCourseClass.getCourseClassId())) {
                continue;
            }
            List<Schedule> registeredSchedules = scheduleRepository.findByCourseClassCourseClassId(registration.getCourseClassId());
            boolean conflicted = targetSchedules.stream()
                    .anyMatch(target -> registeredSchedules.stream().anyMatch(registered -> sameScheduleSlot(target, registered)));
            if (conflicted) {
                throw new BusinessException("Lịch học lại/cải thiện bị trùng với học phần đã đăng ký trong học kỳ");
            }
        }
    }

    private boolean sameScheduleSlot(Schedule first, Schedule second) {
        if (first.getTimeSlot() == null || second.getTimeSlot() == null) {
            return false;
        }
        boolean sameTimeSlot = first.getTimeSlot().getTimeSlotId().equals(second.getTimeSlot().getTimeSlotId());
        if (!sameTimeSlot) {
            return false;
        }
        if (first.getDate() != null && second.getDate() != null) {
            return first.getDate().equals(second.getDate());
        }
        return first.getDayOfWeek() != null && first.getDayOfWeek().equals(second.getDayOfWeek());
    }

    private CourseClass requireCourseClass(UUID courseClassId) {
        return courseClassRepository.findById(courseClassId)
                .orElseThrow(() -> new ResourceNotFoundException("Lớp học phần không tồn tại"));
    }

    private Student requireCurrentStudent(String username) {
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new ResourceNotFoundException("Không tìm thấy tài khoản đăng nhập"));
        if (user.getPerson() == null || user.getPerson().getPersonId() == null) {
            throw new BusinessException("Tài khoản chưa liên kết hồ sơ cá nhân");
        }
        return studentRepository.findByPersonPersonId(user.getPerson().getPersonId())
                .orElseThrow(() -> new ResourceNotFoundException("Không tìm thấy hồ sơ sinh viên của tài khoản hiện tại"));
    }

    private Map<UUID, StudentSummary> latestFinalizedSummariesByCourse(UUID studentId) {
        return summaryRepository.findFinalizedByStudent(studentId).stream()
                .filter(summary -> summary.getCourseRegistration() != null)
                .filter(summary -> summary.getCourseRegistration().getCourseClass() != null)
                .filter(summary -> summary.getCourseRegistration().getCourseClass().getCourseId() != null)
                .collect(Collectors.toMap(
                        summary -> summary.getCourseRegistration().getCourseClass().getCourseId(),
                        Function.identity(),
                        (current, ignored) -> current,
                        LinkedHashMap::new));
    }

    private RetakeImprovementOptionResponse toRetakeImprovementOption(
            Student student,
            CourseClass courseClass,
            StudentSummary previousSummary) {
        int registrationType = resolveRetakeOrImproveType(previousSummary);
        String blockedReason = getBlockReason(student, courseClass);
        int currentStudent = courseClass.getCurrentStudent() == null ? 0 : courseClass.getCurrentStudent();
        Integer availableSeats = courseClass.getMaxStudent() == null ? null : Math.max(courseClass.getMaxStudent() - currentStudent, 0);
        return RetakeImprovementOptionResponse.builder()
                .courseClassId(courseClass.getCourseClassId())
                .courseClassCode(courseClass.getClassCode())
                .courseId(courseClass.getCourseId())
                .courseCode(courseClass.getCourse() == null ? null : courseClass.getCourse().getCode())
                .courseName(courseClass.getCourse() == null ? null : courseClass.getCourse().getName())
                .semesterId(courseClass.getSemesterId())
                .startDate(courseClass.getStartDate())
                .endDate(courseClass.getEndDate())
                .maxStudent(courseClass.getMaxStudent())
                .currentStudent(courseClass.getCurrentStudent())
                .availableSeats(availableSeats)
                .registrationType(registrationType)
                .registrationTypeName(registrationTypeName(registrationType))
                .previousCourseRegistrationId(previousSummary.getCourseRegistrationId())
                .previousTotalScore(previousSummary.getTotalScore())
                .previousLetterGrade(previousSummary.getLetterGrade())
                .previousResult(previousSummary.getResult())
                .canRegister(blockedReason == null)
                .blockedReason(blockedReason)
                .build();
    }

    private String getBlockReason(Student student, CourseClass courseClass) {
        if (isFull(courseClass)) {
            return "Lớp học phần đã đầy sinh viên";
        }
        try {
            validateCourseBelongsToTrainingProgram(student, courseClass.getCourseId());
            validateDuplicateCourseInSemester(student.getStudentId(), courseClass);
            validateScheduleConflict(student.getStudentId(), courseClass);
            return null;
        } catch (BusinessException ex) {
            return ex.getMessage();
        }
    }

    private boolean isFull(CourseClass courseClass) {
        return courseClass.getCurrentStudent() != null
                && courseClass.getMaxStudent() != null
                && courseClass.getCurrentStudent() >= courseClass.getMaxStudent();
    }
}

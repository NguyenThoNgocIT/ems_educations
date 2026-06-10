package com.quanlydaotao.backend.course.service.impl;

import com.quanlydaotao.backend.common.exception.BusinessException;
import com.quanlydaotao.backend.common.exception.ResourceNotFoundException;
import com.quanlydaotao.backend.course.dto.AdminAddCourseClassStudentRequest;
import com.quanlydaotao.backend.course.dto.CourseClassDto;
import com.quanlydaotao.backend.course.dto.CourseClassStudentResponse;
import com.quanlydaotao.backend.course.entity.Course;
import com.quanlydaotao.backend.course.entity.CourseClass;
import com.quanlydaotao.backend.course.entity.CourseRegistration;
import com.quanlydaotao.backend.course.mapper.CourseClassMapper;
import com.quanlydaotao.backend.course.repository.CourseClassRepository;
import com.quanlydaotao.backend.course.repository.CourseRegistrationRepository;
import com.quanlydaotao.backend.course.repository.CourseRepository;
import com.quanlydaotao.backend.course.service.CourseClassService;
import com.quanlydaotao.backend.person.entity.Person;
import com.quanlydaotao.backend.registrationperiod.entity.RegistrationPeriod;
import com.quanlydaotao.backend.registrationperiod.repository.RegistrationPeriodRepository;
import com.quanlydaotao.backend.scheduling.entity.Schedule;
import com.quanlydaotao.backend.scheduling.repository.ScheduleRepository;
import com.quanlydaotao.backend.semester.entity.Semester;
import com.quanlydaotao.backend.semester.repository.SemesterRepository;
import com.quanlydaotao.backend.student.entity.Student;
import com.quanlydaotao.backend.student.repository.StudentRepository;
import com.quanlydaotao.backend.trainingprogramcourse.repository.TrainingProgramCourseRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.util.StringUtils;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Locale;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class CourseClassServiceImpl implements CourseClassService {

    private final CourseClassRepository courseClassRepository;
    private final CourseRepository courseRepository;
    private final SemesterRepository semesterRepository;
    private final CourseRegistrationRepository courseRegistrationRepository;
    private final StudentRepository studentRepository;
    private final RegistrationPeriodRepository registrationPeriodRepository;
    private final TrainingProgramCourseRepository trainingProgramCourseRepository;
    private final ScheduleRepository scheduleRepository;
    private final CourseClassMapper courseClassMapper;

    @Override
    @Transactional
    public CourseClassDto createCourseClass(CourseClassDto courseClassDto) {
        validateRequired(courseClassDto);
        Course course = courseRepository.findById(courseClassDto.getCourseId())
                .orElseThrow(() -> new ResourceNotFoundException("Không tìm thấy môn học"));
        Semester semester = semesterRepository.findById(courseClassDto.getSemesterId())
                .orElseThrow(() -> new ResourceNotFoundException("Không tìm thấy học kỳ"));

        if (Boolean.FALSE.equals(course.getIsActive())) {
            throw new BusinessException("Không thể mở lớp cho môn học đang ngừng hoạt động");
        }
        validateCapacity(courseClassDto);
        validateDateRange(courseClassDto, semester);
        String classCode = normalizeCode(courseClassDto.getClassCode());

        if (courseClassRepository.findByClassCodeAndSemesterIdAndCourseId(
                classCode,
                courseClassDto.getSemesterId(),
                courseClassDto.getCourseId()).isPresent()) {
            throw new BusinessException("Mã lớp học phần này đã tồn tại trong học kỳ");
        }

        CourseClass courseClass = courseClassMapper.toEntity(courseClassDto);
        courseClass.setClassCode(classCode);
        courseClass.setCurrentStudent(0);
        courseClass.setIsActive(true);
        return courseClassMapper.toDto(courseClassRepository.save(courseClass));
    }

    @Override
    @Transactional(readOnly = true)
    public CourseClassDto getCourseClassById(UUID id) {
        CourseClass courseClass = courseClassRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Không tìm thấy lớp học phần"));
        return courseClassMapper.toDto(courseClass);
    }

    @Override
    @Transactional(readOnly = true)
    public List<CourseClassDto> getAllCourseClasses() {
        return courseClassMapper.toDtoList(courseClassRepository.findAll());
    }

    @Override
    @Transactional(readOnly = true)
    public List<CourseClassDto> getCourseClassesByCourse(UUID courseId) {
        return courseClassMapper.toDtoList(courseClassRepository.findByCourseId(courseId));
    }

    @Override
    @Transactional(readOnly = true)
    public List<CourseClassDto> getCourseClassesBySemester(UUID semesterId) {
        return courseClassMapper.toDtoList(courseClassRepository.findBySemesterId(semesterId));
    }

    @Override
    @Transactional(readOnly = true)
    public List<CourseClassStudentResponse> getStudentsByCourseClass(UUID courseClassId) {
        if (!courseClassRepository.existsById(courseClassId)) {
            throw new ResourceNotFoundException("KhÃ´ng tÃ¬m tháº¥y lá»›p há»c pháº§n");
        }

        return courseRegistrationRepository.findByCourseClassIdAndIsActiveTrue(courseClassId).stream()
                .map(this::toCourseClassStudentResponse)
                .toList();
    }

    @Override
    @Transactional
    public CourseClassStudentResponse addStudentToCourseClass(UUID courseClassId, AdminAddCourseClassStudentRequest request) {
        CourseClass courseClass = courseClassRepository.findById(courseClassId)
                .orElseThrow(() -> new ResourceNotFoundException("Không tìm thấy lớp học phần"));
        Student student = studentRepository.findById(request.getStudentId())
                .orElseThrow(() -> new ResourceNotFoundException("Không tìm thấy sinh viên"));

        if (!Boolean.TRUE.equals(courseClass.getIsActive())) {
            throw new BusinessException("Lớp học phần không còn hoạt động");
        }
        if (courseRegistrationRepository.existsByStudentIdAndCourseClassIdAndIsActiveTrue(student.getStudentId(), courseClassId)) {
            throw new BusinessException("Sinh viên đã có trong lớp học phần này");
        }

        long currentCount = courseRegistrationRepository.countByCourseClassIdAndIsActiveTrue(courseClassId);
        if (courseClass.getMaxStudent() != null && currentCount >= courseClass.getMaxStudent()) {
            throw new BusinessException("Lớp học phần đã đủ sĩ số");
        }

        validateStudentCanJoinCourseClass(student, courseClass);
        validateDuplicateCourseInSemester(student.getStudentId(), courseClass);
        validateScheduleConflict(student.getStudentId(), courseClass);

        RegistrationPeriod period = resolveRegistrationPeriod(request.getRegistrationPeriodId(), courseClass.getSemesterId());
        CourseRegistration registration = CourseRegistration.builder()
                .studentId(student.getStudentId())
                .courseClassId(courseClassId)
                .registrationPeriodId(period.getRegistrationPeriodId())
                .registrationType(request.getRegistrationType() == null ? 0 : request.getRegistrationType())
                .registeredAt(LocalDateTime.now())
                .status(request.getStatus() == null ? 1 : request.getStatus())
                .isPaid(Boolean.TRUE.equals(request.getIsPaid()))
                .build();
        registration.setIsActive(true);

        CourseRegistration saved = courseRegistrationRepository.save(registration);
        refreshCourseClassStudentCount(courseClass);
        return toCourseClassStudentResponse(saved);
    }

    @Override
    @Transactional
    public CourseClassStudentResponse transferStudentCourseClass(UUID courseRegistrationId, UUID targetCourseClassId) {
        if (targetCourseClassId == null) {
            throw new BusinessException("Lớp học phần chuyển đến không được để trống");
        }

        CourseRegistration registration = courseRegistrationRepository.findById(courseRegistrationId)
                .orElseThrow(() -> new ResourceNotFoundException("Không tìm thấy đăng ký học phần"));
        CourseClass sourceClass = courseClassRepository.findById(registration.getCourseClassId())
                .orElseThrow(() -> new ResourceNotFoundException("Không tìm thấy lớp học phần hiện tại"));
        CourseClass targetClass = courseClassRepository.findById(targetCourseClassId)
                .orElseThrow(() -> new ResourceNotFoundException("Không tìm thấy lớp học phần chuyển đến"));

        if (sourceClass.getCourseClassId().equals(targetClass.getCourseClassId())) {
            throw new BusinessException("Sinh viên đang ở lớp học phần này");
        }
        if (!Boolean.TRUE.equals(targetClass.getIsActive())) {
            throw new BusinessException("Lớp học phần chuyển đến không còn hoạt động");
        }
        if (!sourceClass.getCourseId().equals(targetClass.getCourseId())
                || !sourceClass.getSemesterId().equals(targetClass.getSemesterId())) {
            throw new BusinessException("Chỉ được chuyển sang lớp học phần cùng môn và cùng học kỳ");
        }
        if (courseRegistrationRepository.existsByStudentIdAndCourseClassIdAndIsActiveTrue(registration.getStudentId(), targetCourseClassId)) {
            throw new BusinessException("Sinh viên đã có trong lớp học phần chuyển đến");
        }

        long targetStudentCount = courseRegistrationRepository.countByCourseClassIdAndIsActiveTrue(targetCourseClassId);
        if (targetClass.getMaxStudent() != null && targetStudentCount >= targetClass.getMaxStudent()) {
            throw new BusinessException("Lớp học phần chuyển đến đã đủ sĩ số");
        }

        registration.setCourseClassId(targetCourseClassId);
        CourseRegistration saved = courseRegistrationRepository.save(registration);
        refreshCourseClassStudentCount(sourceClass);
        refreshCourseClassStudentCount(targetClass);
        return toCourseClassStudentResponse(saved);
    }

    @Override
    @Transactional
    public CourseClassDto updateCourseClass(UUID id, CourseClassDto courseClassDto) {
        CourseClass courseClass = courseClassRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Không tìm thấy lớp học phần"));

        UUID semesterId = courseClassDto.getSemesterId() == null ? courseClass.getSemesterId() : courseClassDto.getSemesterId();
        UUID courseId = courseClassDto.getCourseId() == null ? courseClass.getCourseId() : courseClassDto.getCourseId();
        String classCode = StringUtils.hasText(courseClassDto.getClassCode())
                ? normalizeCode(courseClassDto.getClassCode())
                : courseClass.getClassCode();
        Semester semester = semesterRepository.findById(semesterId)
                .orElseThrow(() -> new ResourceNotFoundException("Không tìm thấy học kỳ"));
        if (!courseRepository.existsById(courseId)) {
            throw new ResourceNotFoundException("Không tìm thấy môn học");
        }
        validateCapacity(courseClassDto);
        validateDateRange(courseClassDto, semester);
        int currentCount = (int) courseRegistrationRepository.countByCourseClassIdAndIsActiveTrue(id);
        if (courseClassDto.getMaxStudent() != null && currentCount > courseClassDto.getMaxStudent()) {
            throw new BusinessException("Sĩ số tối đa không được nhỏ hơn số sinh viên hiện có");
        }
        courseClassRepository.findByClassCodeAndSemesterIdAndCourseId(classCode, semesterId, courseId)
                .filter(existing -> !existing.getCourseClassId().equals(id))
                .ifPresent(existing -> {
                    throw new BusinessException("Mã lớp học phần này đã tồn tại trong học kỳ");
                });

        courseClassMapper.updateEntityFromDto(courseClassDto, courseClass);
        courseClass.setClassCode(classCode);
        return courseClassMapper.toDto(courseClassRepository.save(courseClass));
    }

    @Override
    @Transactional
    public void deleteCourseClass(UUID id) {
        CourseClass courseClass = courseClassRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Không tìm thấy lớp học phần"));
        courseClass.setIsActive(false);
        courseClass.setDeletedAt(LocalDateTime.now());
        courseClassRepository.save(courseClass);
    }

    private void validateRequired(CourseClassDto request) {
        if (!StringUtils.hasText(request.getClassCode()) || request.getCourseId() == null || request.getSemesterId() == null) {
            throw new BusinessException("Mã lớp học phần, học kỳ và môn học không được để trống");
        }
    }

    private void validateCapacity(CourseClassDto request) {
        if (request.getMaxStudent() != null && request.getMaxStudent() <= 0) {
            throw new BusinessException("Sĩ số tối đa của lớp học phần phải lớn hơn 0");
        }
        if (request.getCurrentStudent() != null && request.getCurrentStudent() < 0) {
            throw new BusinessException("Sĩ số hiện tại của lớp học phần không được âm");
        }
        if (request.getCurrentStudent() != null && request.getMaxStudent() != null
                && request.getCurrentStudent() > request.getMaxStudent()) {
            throw new BusinessException("Sĩ số hiện tại không được lớn hơn sĩ số tối đa");
        }
    }

    private void validateDateRange(CourseClassDto request, Semester semester) {
        if (request.getStartDate() != null && request.getEndDate() != null
                && request.getStartDate().isAfter(request.getEndDate())) {
            throw new BusinessException("Ngày bắt đầu lớp học phần phải nhỏ hơn hoặc bằng ngày kết thúc");
        }
        if (request.getStartDate() != null && (request.getStartDate().isBefore(semester.getStartDate())
                || request.getStartDate().isAfter(semester.getEndDate()))) {
            throw new BusinessException("Ngày bắt đầu lớp học phần phải nằm trong học kỳ");
        }
        if (request.getEndDate() != null && (request.getEndDate().isBefore(semester.getStartDate())
                || request.getEndDate().isAfter(semester.getEndDate()))) {
            throw new BusinessException("Ngày kết thúc lớp học phần phải nằm trong học kỳ");
        }
    }

    private String normalizeCode(String code) {
        return code.trim().toUpperCase(Locale.ROOT);
    }

    private RegistrationPeriod resolveRegistrationPeriod(UUID registrationPeriodId, UUID semesterId) {
        if (registrationPeriodId != null) {
            RegistrationPeriod period = registrationPeriodRepository.findById(registrationPeriodId)
                    .orElseThrow(() -> new ResourceNotFoundException("Không tìm thấy đợt đăng ký"));
            if (!semesterId.equals(period.getSemesterId())) {
                throw new BusinessException("Đợt đăng ký không thuộc học kỳ của lớp học phần");
            }
            return period;
        }

        List<RegistrationPeriod> defaultPeriods = registrationPeriodRepository.findDefaultAdminPeriods(semesterId);
        if (!defaultPeriods.isEmpty()) {
            return defaultPeriods.get(0);
        }
        List<RegistrationPeriod> activePeriods = registrationPeriodRepository.findActivePeriodsBySemester(semesterId);
        if (!activePeriods.isEmpty()) {
            return activePeriods.get(0);
        }
        throw new BusinessException("Chưa có đợt đăng ký trong học kỳ này để ghi nhận sinh viên vào lớp học phần");
    }

    private void validateStudentCanJoinCourseClass(Student student, CourseClass courseClass) {
        if (student.getTrainingProgramId() == null) {
            throw new BusinessException("Sinh viên chưa được gán chương trình đào tạo");
        }
        if (!trainingProgramCourseRepository.existsByTrainingProgramIdAndCourseIdAndIsActiveTrue(
                student.getTrainingProgramId(), courseClass.getCourseId())) {
            throw new BusinessException("Học phần không thuộc chương trình đào tạo hiện tại của sinh viên");
        }
    }

    private void validateDuplicateCourseInSemester(UUID studentId, CourseClass courseClass) {
        List<UUID> sameCourseClassIds = courseClassRepository
                .findBySemesterIdAndCourseId(courseClass.getSemesterId(), courseClass.getCourseId())
                .stream()
                .map(CourseClass::getCourseClassId)
                .toList();
        boolean existed = courseRegistrationRepository.findByStudentIdAndIsActiveTrue(studentId).stream()
                .anyMatch(registration -> sameCourseClassIds.contains(registration.getCourseClassId()));
        if (existed) {
            throw new BusinessException("Sinh viên đã có học phần này trong học kỳ");
        }
    }

    private void validateScheduleConflict(UUID studentId, CourseClass targetCourseClass) {
        List<Schedule> targetSchedules = scheduleRepository.findByCourseClassCourseClassId(targetCourseClass.getCourseClassId());
        if (targetSchedules.isEmpty()) {
            return;
        }
        List<CourseRegistration> activeRegistrations = courseRegistrationRepository.findByStudentIdAndIsActiveTrue(studentId);
        for (CourseRegistration registration : activeRegistrations) {
            if (registration.getCourseClassId().equals(targetCourseClass.getCourseClassId())) {
                continue;
            }
            List<Schedule> registeredSchedules = scheduleRepository.findByCourseClassCourseClassId(registration.getCourseClassId());
            boolean conflicted = targetSchedules.stream()
                    .anyMatch(target -> registeredSchedules.stream().anyMatch(registered -> sameScheduleSlot(target, registered)));
            if (conflicted) {
                throw new BusinessException("Lịch học bị trùng với học phần sinh viên đã có trong học kỳ");
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

    private CourseClassStudentResponse toCourseClassStudentResponse(CourseRegistration registration) {
        Student student = registration.getStudent();
        Person person = student != null ? student.getPerson() : null;

        return CourseClassStudentResponse.builder()
                .courseRegistrationId(registration.getCourseRegistrationId())
                .studentId(registration.getStudentId())
                .studentCode(student != null ? student.getStudentCode() : null)
                .fullName(person != null ? person.getFullName() : null)
                .contactEmail(person != null ? person.getContactEmail() : null)
                .phoneNumber(person != null ? person.getPhoneNumber() : null)
                .courseClassId(registration.getCourseClassId())
                .registrationType(registration.getRegistrationType())
                .status(registration.getStatus())
                .isPaid(registration.getIsPaid())
                .registeredAt(registration.getRegisteredAt())
                .build();
    }

    private void refreshCourseClassStudentCount(CourseClass courseClass) {
        courseClass.setCurrentStudent((int) courseRegistrationRepository.countByCourseClassIdAndIsActiveTrue(courseClass.getCourseClassId()));
        courseClassRepository.save(courseClass);
    }
}

package com.quanlydaotao.backend.grade.service.impl;

import com.quanlydaotao.backend.common.exception.BusinessException;
import com.quanlydaotao.backend.common.exception.ResourceNotFoundException;
import com.quanlydaotao.backend.course.entity.Course;
import com.quanlydaotao.backend.course.entity.CourseClass;
import com.quanlydaotao.backend.course.entity.CourseRegistration;
import com.quanlydaotao.backend.course.repository.CourseClassRepository;
import com.quanlydaotao.backend.course.repository.CourseRegistrationRepository;
import com.quanlydaotao.backend.course.repository.CourseRepository;
import com.quanlydaotao.backend.employee.repository.EmployeeRepository;
import com.quanlydaotao.backend.grade.dto.GradeComponentRequest;
import com.quanlydaotao.backend.grade.dto.GradeComponentResponse;
import com.quanlydaotao.backend.grade.dto.InstructorCourseClassStudentGradeResponse;
import com.quanlydaotao.backend.grade.dto.InstructorGradeCourseClassResponse;
import com.quanlydaotao.backend.grade.dto.StudentComponentGradeRequest;
import com.quanlydaotao.backend.grade.dto.StudentComponentGradeResponse;
import com.quanlydaotao.backend.grade.dto.StudentSummaryResponse;
import com.quanlydaotao.backend.grade.entity.GradeComponent;
import com.quanlydaotao.backend.grade.entity.GradeScale;
import com.quanlydaotao.backend.grade.entity.StudentComponentGrade;
import com.quanlydaotao.backend.grade.entity.StudentComponentGradeId;
import com.quanlydaotao.backend.grade.entity.StudentSummary;
import com.quanlydaotao.backend.grade.mapper.GradeComponentMapper;
import com.quanlydaotao.backend.grade.mapper.StudentGradeMapper;
import com.quanlydaotao.backend.grade.repository.GradeComponentRepository;
import com.quanlydaotao.backend.grade.repository.GradeScaleRepository;
import com.quanlydaotao.backend.grade.repository.StudentComponentGradeRepository;
import com.quanlydaotao.backend.grade.repository.StudentSummaryRepository;
import com.quanlydaotao.backend.grade.service.GradeService;
import com.quanlydaotao.backend.instructor.entity.InstructorProfile;
import com.quanlydaotao.backend.instructor.repository.InstructorProfileRepository;
import com.quanlydaotao.backend.teachingassignment.entity.TeachingAssignment;
import com.quanlydaotao.backend.teachingassignment.repository.TeachingAssignmentRepository;
import com.quanlydaotao.backend.user.entity.User;
import com.quanlydaotao.backend.user.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.util.LinkedHashSet;
import java.util.List;
import java.util.Map;
import java.util.Objects;
import java.util.Set;
import java.util.UUID;
import java.util.function.Function;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class GradeServiceImpl implements GradeService {
    private static final BigDecimal PASSING_SCORE = BigDecimal.valueOf(4.0D);
    private static final BigDecimal ONE_HUNDRED = BigDecimal.valueOf(100);

    private final GradeComponentRepository componentRepository;
    private final StudentComponentGradeRepository componentGradeRepository;
    private final StudentSummaryRepository summaryRepository;
    private final GradeScaleRepository scaleRepository;
    private final CourseRepository courseRepository;
    private final CourseClassRepository courseClassRepository;
    private final CourseRegistrationRepository registrationRepository;
    private final UserRepository userRepository;
    private final EmployeeRepository employeeRepository;
    private final InstructorProfileRepository instructorProfileRepository;
    private final TeachingAssignmentRepository teachingAssignmentRepository;
    private final GradeComponentMapper componentMapper;
    private final StudentGradeMapper studentGradeMapper;

    @Override
    @Transactional
    public GradeComponentResponse createComponent(GradeComponentRequest request) {
        validateComponentRequest(request, null);
        Course course = requireCourse(request.getCourseId());
        GradeComponent entity = componentMapper.toEntity(request);
        entity.setCourseId(course.getCourseId());
        entity.setComponentCode(request.getComponentCode().trim().toUpperCase());
        entity.setComponentName(request.getComponentName().trim());
        entity.setIsRequired(Boolean.TRUE.equals(request.getIsRequired()));
        entity.setIsActive(true);
        return componentMapper.toDto(componentRepository.save(entity));
    }

    @Override
    @Transactional
    public GradeComponentResponse updateComponent(UUID componentId, GradeComponentRequest request) {
        GradeComponent entity = componentRepository.findById(componentId)
                .orElseThrow(() -> new ResourceNotFoundException("Không tìm thấy cột điểm"));
        validateComponentRequest(request, componentId);
        componentMapper.updateEntityFromDto(request, entity);
        entity.setComponentCode(request.getComponentCode().trim().toUpperCase());
        entity.setComponentName(request.getComponentName().trim());
        entity.setIsRequired(Boolean.TRUE.equals(request.getIsRequired()));
        return componentMapper.toDto(componentRepository.save(entity));
    }

    @Override
    @Transactional(readOnly = true)
    public List<GradeComponentResponse> getComponents(UUID courseId) {
        return componentMapper.toDtoList(componentRepository.findByCourseIdAndIsActiveTrueOrderByInputOrderAsc(courseId));
    }

    @Override
    @Transactional
    public StudentComponentGradeResponse upsertComponentScore(UUID courseRegistrationId, StudentComponentGradeRequest request) {
        CourseRegistration registration = requireRegistration(courseRegistrationId);
        return upsertComponentScoreInternal(registration, request);
    }

    private StudentComponentGradeResponse upsertComponentScoreInternal(
            CourseRegistration registration,
            StudentComponentGradeRequest request) {
        UUID courseRegistrationId = registration.getCourseRegistrationId();
        summaryRepository.findById(courseRegistrationId)
                .filter(summary -> Boolean.TRUE.equals(summary.getIsFinalized()))
                .ifPresent(summary -> {
                    throw new BusinessException("Điểm học phần đã chốt, không thể cập nhật điểm thành phần");
                });
        GradeComponent component = componentRepository.findById(request.getGradeComponentId())
                .orElseThrow(() -> new ResourceNotFoundException("Không tìm thấy cột điểm"));
        if (!component.getCourseId().equals(registration.getCourseClass().getCourseId())) {
            throw new BusinessException("Cột điểm không thuộc học phần của lớp học phần này");
        }
        validateScore(request.getScore(), component);

        StudentComponentGradeId id = new StudentComponentGradeId(courseRegistrationId, request.getGradeComponentId());
        StudentComponentGrade entity = componentGradeRepository.findById(id).orElseGet(() -> {
            StudentComponentGrade created = new StudentComponentGrade();
            created.setId(id);
            created.setCourseRegistration(registration);
            created.setGradeComponent(component);
            created.setIsActive(true);
            return created;
        });
        if (Boolean.TRUE.equals(entity.getIsLocked())) {
            throw new BusinessException("Điểm thành phần đã khóa, không thể cập nhật");
        }
        entity.setScore(request.getScore());
        entity.setNote(request.getNote());
        return studentGradeMapper.toComponentDto(componentGradeRepository.save(entity));
    }

    @Override
    @Transactional(readOnly = true)
    public List<StudentComponentGradeResponse> getComponentScores(UUID courseRegistrationId) {
        return studentGradeMapper.toComponentDtoList(
                componentGradeRepository.findByCourseRegistrationCourseRegistrationIdAndIsActiveTrue(courseRegistrationId));
    }

    @Override
    @Transactional
    public StudentSummaryResponse finalizeSummary(UUID courseRegistrationId) {
        CourseRegistration registration = requireRegistration(courseRegistrationId);
        UUID courseId = registration.getCourseClass().getCourseId();
        List<GradeComponent> components = componentRepository.findByCourseIdAndIsActiveTrueOrderByInputOrderAsc(courseId);
        if (components.isEmpty()) {
            throw new BusinessException("Học phần chưa cấu hình cột điểm");
        }
        List<StudentComponentGrade> scores = componentGradeRepository
                .findByCourseRegistrationCourseRegistrationIdAndIsActiveTrue(courseRegistrationId);
        BigDecimal total = calculateTotal(components, scores);
        GradeScale scale = scaleRepository.findScaleForScore(total).orElse(null);

        StudentSummary summary = summaryRepository.findById(courseRegistrationId).orElseGet(() -> {
            StudentSummary created = new StudentSummary();
            created.setCourseRegistration(registration);
            created.setIsActive(true);
            return created;
        });
        summary.setTotalScore(total);
        summary.setGradeScaleId(scale == null ? null : scale.getGradeScaleId());
        summary.setLetterGrade(scale == null ? fallbackLetter(total) : scale.getLetterGrade());
        summary.setGpaValue(scale == null ? fallbackGpa(total) : scale.getGpaValue());
        summary.setResult(total.compareTo(PASSING_SCORE) >= 0 ? "PASSED" : "FAILED");
        summary.setIsFinalized(true);

        scores.forEach(score -> score.setIsLocked(true));
        componentGradeRepository.saveAll(scores);
        return studentGradeMapper.toSummaryDto(summaryRepository.save(summary));
    }

    @Override
    @Transactional(readOnly = true)
    public StudentSummaryResponse getSummary(UUID courseRegistrationId) {
        return studentGradeMapper.toSummaryDto(summaryRepository.findById(courseRegistrationId)
                .orElseThrow(() -> new ResourceNotFoundException("Không tìm thấy kết quả tổng kết")));
    }

    @Override
    @Transactional(readOnly = true)
    public List<StudentSummaryResponse> getStudentSummaries(UUID studentId) {
        return studentGradeMapper.toSummaryDtoList(summaryRepository.findFinalizedByStudent(studentId));
    }

    @Override
    @Transactional(readOnly = true)
    public List<InstructorGradeCourseClassResponse> getCurrentInstructorCourseClasses(String username, UUID semesterId) {
        InstructorProfile instructor = requireCurrentInstructor(username);
        List<TeachingAssignment> assignments = teachingAssignmentRepository.findByInstructorIdAndIsActiveTrue(instructor.getInstructorId()).stream()
                .filter(item -> semesterId == null || semesterId.equals(item.getSemesterId()))
                .toList();
        Set<UUID> courseClassIds = assignments.stream()
                .map(TeachingAssignment::getCourseClassId)
                .collect(Collectors.toCollection(LinkedHashSet::new));
        Map<UUID, CourseClass> courseClasses = courseClassRepository.findAllById(courseClassIds).stream()
                .collect(Collectors.toMap(CourseClass::getCourseClassId, Function.identity()));
        return courseClassIds.stream()
                .map(courseClasses::get)
                .filter(Objects::nonNull)
                .map(this::toInstructorCourseClassResponse)
                .toList();
    }

    @Override
    @Transactional(readOnly = true)
    public List<GradeComponentResponse> getCurrentInstructorCourseClassComponents(String username, UUID courseClassId) {
        InstructorProfile instructor = requireCurrentInstructor(username);
        CourseClass courseClass = requireAssignedCourseClass(instructor.getInstructorId(), courseClassId);
        return componentMapper.toDtoList(componentRepository.findByCourseIdAndIsActiveTrueOrderByInputOrderAsc(courseClass.getCourseId()));
    }

    @Override
    @Transactional(readOnly = true)
    public List<InstructorCourseClassStudentGradeResponse> getCurrentInstructorCourseClassStudents(String username, UUID courseClassId) {
        InstructorProfile instructor = requireCurrentInstructor(username);
        requireAssignedCourseClass(instructor.getInstructorId(), courseClassId);
        return registrationRepository.findByCourseClassIdAndIsActiveTrue(courseClassId).stream()
                .map(this::toInstructorStudentGradeResponse)
                .toList();
    }

    @Override
    @Transactional(readOnly = true)
    public List<StudentComponentGradeResponse> getCurrentInstructorComponentScores(String username, UUID courseRegistrationId) {
        CourseRegistration registration = requireRegistration(courseRegistrationId);
        InstructorProfile instructor = requireCurrentInstructor(username);
        requireAssignedCourseClass(instructor.getInstructorId(), registration.getCourseClassId());
        return getComponentScores(courseRegistrationId);
    }

    @Override
    @Transactional
    public StudentComponentGradeResponse upsertCurrentInstructorComponentScore(
            String username,
            UUID courseRegistrationId,
            StudentComponentGradeRequest request) {
        CourseRegistration registration = requireRegistration(courseRegistrationId);
        InstructorProfile instructor = requireCurrentInstructor(username);
        requireAssignedCourseClass(instructor.getInstructorId(), registration.getCourseClassId());
        return upsertComponentScoreInternal(registration, request);
    }

    private void validateComponentRequest(GradeComponentRequest request, UUID ignoredComponentId) {
        if (request.getWeightPercentage() != null
                && (request.getWeightPercentage().compareTo(BigDecimal.ZERO) < 0
                || request.getWeightPercentage().compareTo(ONE_HUNDRED) > 0)) {
            throw new BusinessException("Tỷ trọng điểm phải nằm trong khoảng 0 đến 100");
        }
        componentRepository.findByCourseIdAndComponentCodeAndIsActiveTrue(request.getCourseId(), request.getComponentCode().trim().toUpperCase())
                .filter(component -> ignoredComponentId == null || !component.getGradeComponentId().equals(ignoredComponentId))
                .ifPresent(component -> {
                    throw new BusinessException("Mã cột điểm đã tồn tại trong học phần");
                });
    }

    private Course requireCourse(UUID courseId) {
        return courseRepository.findById(courseId)
                .orElseThrow(() -> new ResourceNotFoundException("Không tìm thấy học phần"));
    }

    private CourseRegistration requireRegistration(UUID courseRegistrationId) {
        return registrationRepository.findById(courseRegistrationId)
                .orElseThrow(() -> new ResourceNotFoundException("Không tìm thấy đăng ký học phần"));
    }

    private InstructorProfile requireCurrentInstructor(String username) {
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new ResourceNotFoundException("Không tìm thấy tài khoản đăng nhập"));
        if (user.getPerson() == null || user.getPerson().getPersonId() == null) {
            throw new BusinessException("Tài khoản chưa liên kết hồ sơ cá nhân");
        }
        return employeeRepository.findByPersonPersonId(user.getPerson().getPersonId())
                .flatMap(employee -> instructorProfileRepository.findByEmployeeEmployeeId(employee.getEmployeeId()))
                .orElseThrow(() -> new ResourceNotFoundException("Không tìm thấy hồ sơ giảng viên của tài khoản hiện tại"));
    }

    private CourseClass requireAssignedCourseClass(UUID instructorId, UUID courseClassId) {
        CourseClass courseClass = courseClassRepository.findById(courseClassId)
                .orElseThrow(() -> new ResourceNotFoundException("Không tìm thấy lớp học phần"));
        if (!teachingAssignmentRepository.existsByInstructorIdAndCourseClassIdAndSemesterIdAndIsActiveTrue(
                instructorId,
                courseClassId,
                courseClass.getSemesterId())) {
            throw new BusinessException("Giảng viên không được phân công nhập điểm cho lớp học phần này");
        }
        return courseClass;
    }

    private InstructorGradeCourseClassResponse toInstructorCourseClassResponse(CourseClass courseClass) {
        List<CourseRegistration> registrations = registrationRepository.findByCourseClassIdAndIsActiveTrue(courseClass.getCourseClassId());
        int gradedStudents = (int) registrations.stream()
                .filter(registration -> !componentGradeRepository
                        .findByCourseRegistrationCourseRegistrationIdAndIsActiveTrue(registration.getCourseRegistrationId())
                        .isEmpty())
                .count();
        int finalizedStudents = (int) registrations.stream()
                .map(registration -> summaryRepository.findById(registration.getCourseRegistrationId()).orElse(null))
                .filter(Objects::nonNull)
                .filter(summary -> Boolean.TRUE.equals(summary.getIsFinalized()))
                .count();
        Course course = courseClass.getCourse();
        return InstructorGradeCourseClassResponse.builder()
                .courseClassId(courseClass.getCourseClassId())
                .classCode(courseClass.getClassCode())
                .courseId(courseClass.getCourseId())
                .courseCode(course == null ? null : course.getCode())
                .courseName(course == null ? null : course.getName())
                .semesterId(courseClass.getSemesterId())
                .startDate(courseClass.getStartDate())
                .endDate(courseClass.getEndDate())
                .maxStudent(courseClass.getMaxStudent())
                .currentStudent(courseClass.getCurrentStudent())
                .totalStudents(registrations.size())
                .gradedStudents(gradedStudents)
                .finalizedStudents(finalizedStudents)
                .build();
    }

    private InstructorCourseClassStudentGradeResponse toInstructorStudentGradeResponse(CourseRegistration registration) {
        StudentSummary summary = summaryRepository.findById(registration.getCourseRegistrationId()).orElse(null);
        List<StudentComponentGradeResponse> componentScores = studentGradeMapper.toComponentDtoList(
                componentGradeRepository.findByCourseRegistrationCourseRegistrationIdAndIsActiveTrue(registration.getCourseRegistrationId()));
        return InstructorCourseClassStudentGradeResponse.builder()
                .studentId(registration.getStudentId())
                .studentCode(registration.getStudent() == null ? null : registration.getStudent().getStudentCode())
                .fullName(registration.getStudent() == null || registration.getStudent().getPerson() == null
                        ? null
                        : registration.getStudent().getPerson().getFullName())
                .courseRegistrationId(registration.getCourseRegistrationId())
                .registrationStatus(registration.getStatus())
                .isFinalized(summary != null && Boolean.TRUE.equals(summary.getIsFinalized()))
                .totalScore(summary == null ? null : summary.getTotalScore())
                .letterGrade(summary == null ? null : summary.getLetterGrade())
                .gpaValue(summary == null ? null : summary.getGpaValue())
                .result(summary == null ? null : summary.getResult())
                .componentScores(componentScores)
                .build();
    }

    private void validateScore(BigDecimal score, GradeComponent component) {
        BigDecimal min = component.getMinScore() == null ? BigDecimal.ZERO : component.getMinScore();
        BigDecimal max = component.getMaxScore() == null ? BigDecimal.TEN : component.getMaxScore();
        if (score.compareTo(min) < 0 || score.compareTo(max) > 0) {
            throw new BusinessException("Điểm phải nằm trong khoảng " + min + " đến " + max);
        }
    }

    private BigDecimal calculateTotal(List<GradeComponent> components, List<StudentComponentGrade> scores) {
        BigDecimal configuredWeight = components.stream()
                .map(component -> component.getWeightPercentage() == null ? BigDecimal.ZERO : component.getWeightPercentage())
                .reduce(BigDecimal.ZERO, BigDecimal::add);
        if (configuredWeight.compareTo(ONE_HUNDRED) != 0) {
            throw new BusinessException("Tổng tỷ trọng điểm của học phần phải bằng 100%");
        }
        BigDecimal total = BigDecimal.ZERO;
        for (GradeComponent component : components) {
            StudentComponentGrade score = scores.stream()
                    .filter(item -> item.getId().getGradeComponentId().equals(component.getGradeComponentId()))
                    .findFirst()
                    .orElse(null);
            if (Boolean.TRUE.equals(component.getIsRequired()) && (score == null || score.getScore() == null)) {
                throw new BusinessException("Chưa nhập đủ điểm bắt buộc: " + component.getComponentName());
            }
            if (score != null && score.getScore() != null) {
                total = total.add(score.getScore()
                        .multiply(component.getWeightPercentage())
                        .divide(ONE_HUNDRED, 4, RoundingMode.HALF_UP));
            }
        }
        return total.setScale(2, RoundingMode.HALF_UP);
    }

    private String fallbackLetter(BigDecimal score) {
        if (score.compareTo(BigDecimal.valueOf(8.5D)) >= 0) return "A";
        if (score.compareTo(BigDecimal.valueOf(7D)) >= 0) return "B";
        if (score.compareTo(BigDecimal.valueOf(5.5D)) >= 0) return "C";
        if (score.compareTo(PASSING_SCORE) >= 0) return "D";
        return "F";
    }

    private BigDecimal fallbackGpa(BigDecimal score) {
        if (score.compareTo(BigDecimal.valueOf(8.5D)) >= 0) return BigDecimal.valueOf(4D);
        if (score.compareTo(BigDecimal.valueOf(7D)) >= 0) return BigDecimal.valueOf(3D);
        if (score.compareTo(BigDecimal.valueOf(5.5D)) >= 0) return BigDecimal.valueOf(2D);
        if (score.compareTo(PASSING_SCORE) >= 0) return BigDecimal.valueOf(1D);
        return BigDecimal.ZERO;
    }
}

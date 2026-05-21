package com.quanlydaotao.backend.course.service.impl;

import com.quanlydaotao.backend.common.exception.BusinessException;
import com.quanlydaotao.backend.common.exception.ResourceNotFoundException;
import com.quanlydaotao.backend.course.entity.*;
import com.quanlydaotao.backend.course.repository.*;
import com.quanlydaotao.backend.equivalentcourse.repository.EquivalentCourseRepository;
import com.quanlydaotao.backend.registrationperiod.entity.RegistrationPeriod;
import com.quanlydaotao.backend.registrationperiod.repository.RegistrationPeriodRepository;
import com.quanlydaotao.backend.course.service.RegistrationService;
import com.quanlydaotao.backend.student.entity.Student;
import com.quanlydaotao.backend.student.repository.StudentRepository;
import com.quanlydaotao.backend.trainingprogramcourse.repository.TrainingProgramCourseRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Set;
import java.util.stream.Collectors;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class RegistrationServiceImpl implements RegistrationService {

    private final CourseRegistrationRepository registrationRepository;
    private final CourseClassRepository courseClassRepository;
    private final CoursePrerequisiteRepository prerequisiteRepository;
    private final StudentGradeRepository gradeRepository;
    private final StudentRepository studentRepository;
    private final RegistrationPeriodRepository registrationPeriodRepository;
    private final TrainingProgramCourseRepository trainingProgramCourseRepository;
    private final EquivalentCourseRepository equivalentCourseRepository;

    @Override
    @Transactional
    public CourseRegistration registerCourse(UUID studentId, UUID courseClassId) {
        Student student = studentRepository.findById(studentId)
                .orElseThrow(() -> new ResourceNotFoundException("Không tìm thấy sinh viên"));
        CourseClass courseClass = courseClassRepository.findById(courseClassId)
                .orElseThrow(() -> new ResourceNotFoundException("Lớp học phần không tồn tại"));
        if (!Boolean.TRUE.equals(courseClass.getIsActive())) {
            throw new BusinessException("Lớp học phần không còn hoạt động");
        }
        RegistrationPeriod period = registrationPeriodRepository.findActivePeriod(courseClass.getSemesterId(), LocalDateTime.now())
                .orElseThrow(() -> new BusinessException("Hiện không có đợt đăng ký học phần hợp lệ"));

        if (registrationRepository.existsByStudentIdAndCourseClassIdAndIsActiveTrue(studentId, courseClassId)) {
            throw new BusinessException("Sinh viên đã đăng ký lớp học phần này");
        }
        if (courseClass.getCurrentStudent() != null && courseClass.getMaxStudent() != null 
            && courseClass.getCurrentStudent() >= courseClass.getMaxStudent()) {
            throw new BusinessException("Lớp học phần đã đầy sinh viên");
        }

        UUID courseId = courseClass.getCourseId();
        validateCourseBelongsToTrainingProgram(student, courseId);
        validateDuplicateCourseInSemester(studentId, courseClass);
        validatePrerequisites(studentId, courseId);

        CourseRegistration registration = CourseRegistration.builder()
                .studentId(studentId)
                .courseClassId(courseClassId)
                .registrationPeriodId(period.getRegistrationPeriodId())
                .registrationType(0)
                .registeredAt(LocalDateTime.now())
                .status(1)
                .isPaid(false)
                .build();
        registration.setIsActive(true);

        courseClass.setCurrentStudent((courseClass.getCurrentStudent() == null ? 0 : courseClass.getCurrentStudent()) + 1);
        courseClassRepository.save(courseClass);

        return registrationRepository.save(registration);
    }

    private void validatePrerequisites(UUID studentId, UUID courseId) {
        List<CoursePrerequisite> prerequisites = prerequisiteRepository.findByCourseId(courseId);
        
        for (CoursePrerequisite pre : prerequisites) {
            UUID preCourseId = pre.getPrerequisiteCourseId();
            String type = pre.getType(); // PREREQUISITE hoặc PARALLEL

            if ("PREREQUISITE".equalsIgnoreCase(type)) {
                if (!hasPassedCourseOrEquivalent(studentId, preCourseId)) {
                    throw new BusinessException("Sinh viên chưa đạt môn tiên quyết: " + preCourseId);
                }
            } else if ("PARALLEL".equalsIgnoreCase(type)) {
                boolean isAlreadyRegistered = registrationRepository.findByStudentId(studentId).stream()
                        .anyMatch(r -> {
                            CourseClass registeredClass = courseClassRepository.findById(r.getCourseClassId()).orElse(null);
                            return registeredClass != null && registeredClass.getCourseId().equals(preCourseId);
                        });
                
                if (!isAlreadyRegistered && !hasPassedCourseOrEquivalent(studentId, preCourseId)) {
                    throw new BusinessException("Sinh viên phải đăng ký môn song hành: " + preCourseId);
                }
            }
        }
    }

    private void validateCourseBelongsToTrainingProgram(Student student, UUID courseId) {
        if (student.getTrainingProgramId() == null) {
            throw new BusinessException("Sinh viên chưa được gán chương trình đào tạo để đăng ký học phần");
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
            throw new BusinessException("Sinh viên đã đăng ký học phần này trong học kỳ");
        }
    }

    private boolean hasPassedCourseOrEquivalent(UUID studentId, UUID courseId) {
        if (hasPassedCourse(studentId, courseId)) {
            return true;
        }
        return equivalentCourseRepository.findByOriginalCourseIdAndIsActiveTrue(courseId).stream()
                .anyMatch(equivalent -> hasPassedCourse(studentId, equivalent.getEquivalentCourseId()));
    }

    private boolean hasPassedCourse(UUID studentId, UUID courseId) {
        return gradeRepository.findByStudentIdAndCourseId(studentId, courseId)
                .filter(grade -> grade.getGrade() != null && grade.getGrade() >= 4.0)
                .isPresent();
    }
}

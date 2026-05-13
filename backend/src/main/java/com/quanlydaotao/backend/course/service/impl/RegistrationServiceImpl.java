package com.quanlydaotao.backend.course.service.impl;

import com.quanlydaotao.backend.common.exception.BusinessException;
import com.quanlydaotao.backend.common.exception.ResourceNotFoundException;
import com.quanlydaotao.backend.course.entity.*;
import com.quanlydaotao.backend.course.repository.*;
import com.quanlydaotao.backend.course.service.RegistrationService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class RegistrationServiceImpl implements RegistrationService {

    private final CourseRegistrationRepository registrationRepository;
    private final CourseClassRepository courseClassRepository;
    private final CoursePrerequisiteRepository prerequisiteRepository;
    private final StudentGradeRepository gradeRepository;

    @Override
    @Transactional
    public CourseRegistration registerCourse(UUID studentId, UUID courseClassId) {
        // 1. Kiểm tra sự tồn tại của lớp học phần
        CourseClass courseClass = courseClassRepository.findById(courseClassId)
                .orElseThrow(() -> new ResourceNotFoundException("Lớp học phần không tồn tại"));

        // 2. Kiểm tra sĩ số
        if (courseClass.getCurrentStudent() != null && courseClass.getMaxStudent() != null 
            && courseClass.getCurrentStudent() >= courseClass.getMaxStudent()) {
            throw new BusinessException("Lớp học phần đã đầy sinh viên");
        }

        UUID courseId = courseClass.getCourseId();

        // 3. Kiểm tra điều kiện tiên quyết và song hành
        List<CoursePrerequisite> prerequisites = prerequisiteRepository.findByCourseId(courseId);
        
        for (CoursePrerequisite pre : prerequisites) {
            UUID preCourseId = pre.getPrerequisiteCourseId();
            String type = pre.getType(); // PREREQUISITE hoặc PARALLEL

            if ("PREREQUISITE".equalsIgnoreCase(type)) {
                // Tiên quyết: Phải có điểm đậu (Grade >= 4.0/10.0 hoặc C tùy thang điểm)
                // Giả sử thang điểm 10, đậu >= 4.0
                StudentGrade grade = gradeRepository.findByStudentIdAndCourseId(studentId, preCourseId)
                        .orElseThrow(() -> new BusinessException("Sinh viên chưa học môn tiên quyết: " + preCourseId));
                
                if (grade.getGrade() == null || grade.getGrade() < 4.0) {
                    throw new BusinessException("Sinh viên chưa đạt môn tiên quyết: " + preCourseId);
                }
            } else if ("PARALLEL".equalsIgnoreCase(type)) {
                // Song hành: Phải đang đăng ký hoặc đã có điểm
                boolean isAlreadyRegistered = registrationRepository.findByStudentId(studentId).stream()
                        .anyMatch(r -> {
                            // Cần lấy CourseId từ CourseClass của registration
                            // Ở đây ta giả định registration lưu CourseClassId
                            CourseClass registeredClass = courseClassRepository.findById(r.getCourseClassId()).orElse(null);
                            return registeredClass != null && registeredClass.getCourseId().equals(preCourseId);
                        });
                
                boolean hasGrade = gradeRepository.findByStudentIdAndCourseId(studentId, preCourseId).isPresent();
                
                if (!isAlreadyRegistered && !hasGrade) {
                    throw new BusinessException("Sinh viên phải đăng ký môn song hành: " + preCourseId);
                }
            }
        }

        // 4. Tạo bản ghi đăng ký
        CourseRegistration registration = CourseRegistration.builder()
                .studentId(studentId)
                .courseClassId(courseClassId)
                .registrationDate(LocalDateTime.now())
                .status("REGISTERED")
                .build();
        registration.setIsActive(true);

        // 5. Cập nhật sĩ số lớp
        courseClass.setCurrentStudent((courseClass.getCurrentStudent() == null ? 0 : courseClass.getCurrentStudent()) + 1);
        courseClassRepository.save(courseClass);

        return registrationRepository.save(registration);
    }
}

package com.quanlydaotao.backend.course.repository;

import com.quanlydaotao.backend.course.entity.CourseRegistration;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.UUID;
import java.util.List;

@Repository
public interface CourseRegistrationRepository extends JpaRepository<CourseRegistration, UUID> {
    List<CourseRegistration> findByStudentId(UUID studentId);
    boolean existsByStudentIdAndCourseClassId(UUID studentId, UUID courseClassId);

    boolean existsByStudentIdAndCourseClassIdAndIsActiveTrue(UUID studentId, UUID courseClassId);

    List<CourseRegistration> findByStudentIdAndIsActiveTrue(UUID studentId);
}

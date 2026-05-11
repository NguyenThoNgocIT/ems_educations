package com.quanlydaotao.backend.course.repository;

import com.quanlydaotao.backend.course.entity.CourseClass;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Repository
public interface CourseClassRepository extends JpaRepository<CourseClass, UUID> {
    Optional<CourseClass> findByClassCodeAndSemesterIdAndCourseId(String classCode, UUID semesterId, UUID courseId);
    List<CourseClass> findByCourseId(UUID courseId);
    List<CourseClass> findBySemesterId(UUID semesterId);
}

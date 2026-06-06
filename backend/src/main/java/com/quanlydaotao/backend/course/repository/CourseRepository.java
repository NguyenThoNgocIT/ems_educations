package com.quanlydaotao.backend.course.repository;

import com.quanlydaotao.backend.course.entity.Course;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;
import java.util.List;
import java.util.UUID;

@Repository
public interface CourseRepository extends JpaRepository<Course, UUID> {
    List<Course> findByDeletedAtIsNull();
    Optional<Course> findByCourseIdAndDeletedAtIsNull(UUID courseId);
    Optional<Course> findByCodeAndDeletedAtIsNull(String code);
    Optional<Course> findByCodeAndCourseIdNotAndDeletedAtIsNull(String code, UUID courseId);
}

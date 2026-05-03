package com.quanlydaotao.backend.course.repository;

import com.quanlydaotao.backend.course.entity.Course;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;
import java.util.UUID;

@Repository
public interface CourseRepository extends JpaRepository<Course, UUID> {
    Optional<Course> findByCode(String code);
    Optional<Course> findByCodeAndIdNot(String code, UUID id);
}

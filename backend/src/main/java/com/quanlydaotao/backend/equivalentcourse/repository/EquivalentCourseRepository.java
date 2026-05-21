package com.quanlydaotao.backend.equivalentcourse.repository;

import com.quanlydaotao.backend.equivalentcourse.entity.EquivalentCourse;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.UUID;

@Repository
public interface EquivalentCourseRepository extends JpaRepository<EquivalentCourse, UUID> {
    List<EquivalentCourse> findByOriginalCourseIdAndIsActiveTrue(UUID originalCourseId);
}

package com.quanlydaotao.backend.grade.repository;

import com.quanlydaotao.backend.grade.entity.GradeComponent;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Repository
public interface GradeComponentRepository extends JpaRepository<GradeComponent, UUID> {
    List<GradeComponent> findByCourseIdAndIsActiveTrueOrderByInputOrderAsc(UUID courseId);

    Optional<GradeComponent> findByCourseIdAndComponentCodeAndIsActiveTrue(UUID courseId, String componentCode);
}

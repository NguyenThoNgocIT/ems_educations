package com.quanlydaotao.backend.course.repository;

import com.quanlydaotao.backend.course.entity.AcademicCohort;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.UUID;

@Repository
public interface AcademicCohortRepository extends JpaRepository<AcademicCohort, UUID> {
}

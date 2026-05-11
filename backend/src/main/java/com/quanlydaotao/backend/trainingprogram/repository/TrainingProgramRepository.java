package com.quanlydaotao.backend.trainingprogram.repository;

import com.quanlydaotao.backend.trainingprogram.entity.TrainingProgram;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

public interface TrainingProgramRepository extends JpaRepository<TrainingProgram, UUID>, JpaSpecificationExecutor<TrainingProgram> {

    Optional<TrainingProgram> findByCode(String code);

    boolean existsByCode(String code);

    List<TrainingProgram> findByMajorId(String majorId);

    List<TrainingProgram> findByDepartmentId(String departmentId);

    List<TrainingProgram> findByAcademicCohortId(String academicCohortId);

    @Query("SELECT t FROM TrainingProgram t WHERE t.code = :code AND t.deletedAt IS NULL")
    Optional<TrainingProgram> findActiveByCode(@Param("code") String code);
}
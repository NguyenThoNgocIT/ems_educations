package com.quanlydaotao.backend.trainingprogram.repository;

import com.quanlydaotao.backend.trainingprogram.entity.TrainingProgram;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Repository
public interface TrainingProgramRepository extends JpaRepository<TrainingProgram, UUID> {
    Optional<TrainingProgram> findByCode(String code);

    @Query("""
            SELECT p
            FROM TrainingProgram p
            WHERE (:keyword IS NULL OR LOWER(p.code) LIKE LOWER(CONCAT('%', :keyword, '%'))
                   OR LOWER(p.name) LIKE LOWER(CONCAT('%', :keyword, '%')))
              AND (:majorId IS NULL OR p.majorId = :majorId)
              AND (:specializationId IS NULL OR p.specializationId = :specializationId)
              AND (:departmentId IS NULL OR p.departmentId = :departmentId)
              AND (:academicCohortId IS NULL OR p.academicCohortId = :academicCohortId)
              AND (:programPhase IS NULL OR p.programPhase = :programPhase)
              AND (:isActive IS NULL OR p.isActive = :isActive)
            ORDER BY p.code ASC
            """)
    List<TrainingProgram> search(String keyword, UUID majorId, UUID specializationId, UUID departmentId,
                                 UUID academicCohortId, String programPhase, Boolean isActive);
}

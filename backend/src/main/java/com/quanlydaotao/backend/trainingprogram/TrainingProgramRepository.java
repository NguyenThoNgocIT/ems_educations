package com.quanlydaotao.backend.trainingprogram;

import java.util.List;
import java.util.Optional;
import java.util.UUID;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

@Repository
public interface TrainingProgramRepository extends JpaRepository<TrainingProgram, UUID> {

    Optional<TrainingProgram> findByProgramCode(String programCode);

    Optional<TrainingProgram> findByProgramCodeIgnoreCase(String programCode);

    Optional<TrainingProgram> findByIdAndIsActiveTrue(UUID id);

    List<TrainingProgram> findByIsActiveTrue();

    Page<TrainingProgram> findByIsActiveTrue(Pageable pageable);

    @Query("SELECT t FROM TrainingProgram t WHERE t.isActive = true AND (LOWER(t.programCode) LIKE LOWER(CONCAT('%', :keyword, '%')) OR LOWER(t.programName) LIKE LOWER(CONCAT('%', :keyword, '%')) OR LOWER(t.academicYear) LIKE LOWER(CONCAT('%', :keyword, '%')))")
    List<TrainingProgram> searchActiveByKeyword(@Param("keyword") String keyword);
}

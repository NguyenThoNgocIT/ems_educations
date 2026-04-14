package com.quanlydaotao.backend.gradescale;

import java.util.List;
import java.util.Optional;
import java.util.UUID;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

@Repository
public interface GradeScaleRepository extends JpaRepository<GradeScale, UUID> {

    Optional<GradeScale> findByScaleName(String scaleName);

    Optional<GradeScale> findByIdAndIsActiveTrue(UUID id);

    List<GradeScale> findByIsActiveTrue();

    List<GradeScale> findByScaleNameContainingIgnoreCaseAndIsActiveTrue(String keyword);

    @Query("SELECT g FROM GradeScale g WHERE g.isActive = true AND :score BETWEEN g.minScore AND g.maxScore")
    Optional<GradeScale> findByScoreBetween(@Param("score") Double score);
}

package com.quanlydaotao.backend.grade.repository;

import com.quanlydaotao.backend.grade.entity.GradeScale;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.math.BigDecimal;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Repository
public interface GradeScaleRepository extends JpaRepository<GradeScale, UUID> {
    @Query("""
            SELECT s
            FROM GradeScale s
            WHERE s.isActive = true
              AND :score >= s.minScore
              AND :score <= s.maxScore
            ORDER BY s.minScore DESC
            """)
    List<GradeScale> findScalesForScore(BigDecimal score);

    default Optional<GradeScale> findScaleForScore(BigDecimal score) {
        return findScalesForScore(score).stream().findFirst();
    }
}

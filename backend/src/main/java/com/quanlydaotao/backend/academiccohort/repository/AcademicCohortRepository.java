package com.quanlydaotao.backend.academiccohort.repository;

import com.quanlydaotao.backend.academiccohort.entity.AcademicCohort;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Repository
public interface AcademicCohortRepository extends JpaRepository<AcademicCohort, UUID> {
    Optional<AcademicCohort> findByCode(String code);

    @Query("""
            SELECT c
            FROM AcademicCohort c
            WHERE (:keyword IS NULL OR LOWER(c.code) LIKE LOWER(CONCAT('%', CAST(:keyword AS String), '%'))
                   OR LOWER(c.name) LIKE LOWER(CONCAT('%', CAST(:keyword AS String), '%')))
              AND (:isActive IS NULL OR c.isActive = :isActive)
            ORDER BY c.startYear DESC, c.code ASC
            """)
    List<AcademicCohort> search(String keyword, Boolean isActive);
}

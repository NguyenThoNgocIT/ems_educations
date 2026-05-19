package com.quanlydaotao.backend.schoolyear.repository;

import com.quanlydaotao.backend.schoolyear.entity.SchoolYear;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Repository
public interface SchoolYearRepository extends JpaRepository<SchoolYear, UUID> {
    Optional<SchoolYear> findByCode(String code);

    @Query("""
            SELECT y
            FROM SchoolYear y
            WHERE (:keyword IS NULL OR LOWER(y.code) LIKE LOWER(CONCAT('%', :keyword, '%'))
                   OR LOWER(y.name) LIKE LOWER(CONCAT('%', :keyword, '%')))
              AND (:isActive IS NULL OR y.isActive = :isActive)
            ORDER BY y.startDate DESC
            """)
    List<SchoolYear> search(String keyword, Boolean isActive);
}

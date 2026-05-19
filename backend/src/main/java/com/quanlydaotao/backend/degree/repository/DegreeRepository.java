package com.quanlydaotao.backend.degree.repository;

import com.quanlydaotao.backend.degree.entity.Degree;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Repository
public interface DegreeRepository extends JpaRepository<Degree, UUID> {
    Optional<Degree> findByCode(String code);

    @Query("""
            SELECT d
            FROM Degree d
            WHERE (:keyword IS NULL OR LOWER(d.code) LIKE LOWER(CONCAT('%', :keyword, '%'))
                   OR LOWER(d.name) LIKE LOWER(CONCAT('%', :keyword, '%'))
                   OR LOWER(d.specialization) LIKE LOWER(CONCAT('%', :keyword, '%')))
              AND (:majorId IS NULL OR d.majorId = :majorId)
              AND (:isActive IS NULL OR d.isActive = :isActive)
            ORDER BY d.level ASC, d.code ASC
            """)
    List<Degree> search(String keyword, UUID majorId, Boolean isActive);
}

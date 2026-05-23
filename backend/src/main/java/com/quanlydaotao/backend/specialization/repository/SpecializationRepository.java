package com.quanlydaotao.backend.specialization.repository;

import com.quanlydaotao.backend.specialization.entity.Specialization;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Repository
public interface SpecializationRepository extends JpaRepository<Specialization, UUID> {
    Optional<Specialization> findByCode(String code);

    @Query("""
            SELECT s
            FROM Specialization s
            WHERE (:keyword IS NULL OR LOWER(s.code) LIKE LOWER(CONCAT('%', CAST(:keyword AS String), '%'))
                   OR LOWER(s.name) LIKE LOWER(CONCAT('%', CAST(:keyword AS String), '%')))
              AND (:departmentId IS NULL OR s.departmentId = :departmentId)
              AND (:majorId IS NULL OR s.majorId = :majorId)
              AND (:isActive IS NULL OR s.isActive = :isActive)
            ORDER BY s.code ASC
            """)
    List<Specialization> search(String keyword, UUID departmentId, UUID majorId, Boolean isActive);
}

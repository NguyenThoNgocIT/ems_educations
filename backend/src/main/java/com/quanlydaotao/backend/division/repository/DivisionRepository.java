package com.quanlydaotao.backend.division.repository;

import com.quanlydaotao.backend.division.entity.Division;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Repository
public interface DivisionRepository extends JpaRepository<Division, UUID> {
    Optional<Division> findByCode(String code);

    @Query("""
            SELECT d
            FROM Division d
            WHERE (:keyword IS NULL OR LOWER(d.code) LIKE LOWER(CONCAT('%', CAST(:keyword AS String), '%'))
                   OR LOWER(d.name) LIKE LOWER(CONCAT('%', CAST(:keyword AS String), '%')))
              AND (:isActive IS NULL OR d.isActive = :isActive)
            ORDER BY d.code ASC
            """)
    List<Division> search(String keyword, Boolean isActive);
}

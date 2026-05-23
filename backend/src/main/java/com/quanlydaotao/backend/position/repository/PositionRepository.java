package com.quanlydaotao.backend.position.repository;

import com.quanlydaotao.backend.position.entity.Position;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Repository
public interface PositionRepository extends JpaRepository<Position, UUID> {
    Optional<Position> findByCode(String code);

    @Query("""
            SELECT p
            FROM Position p
            WHERE (:keyword IS NULL OR LOWER(p.code) LIKE LOWER(CONCAT('%', CAST(:keyword AS String), '%'))
                   OR LOWER(p.name) LIKE LOWER(CONCAT('%', CAST(:keyword AS String), '%')))
              AND (:divisionId IS NULL OR p.divisionId = :divisionId)
              AND (:isActive IS NULL OR p.isActive = :isActive)
            ORDER BY p.code ASC
            """)
    List<Position> search(String keyword, UUID divisionId, Boolean isActive);
}

package com.quanlydaotao.backend.major.repository;

import com.quanlydaotao.backend.major.entity.Major;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Repository
public interface MajorRepository extends JpaRepository<Major, UUID> {
    Optional<Major> findByCode(String code);

    @Query("""
            SELECT m
            FROM Major m
            WHERE (:keyword IS NULL OR LOWER(m.code) LIKE LOWER(CONCAT('%', :keyword, '%'))
                   OR LOWER(m.name) LIKE LOWER(CONCAT('%', :keyword, '%')))
              AND (:departmentId IS NULL OR m.departmentId = :departmentId)
              AND (:isActive IS NULL OR m.isActive = :isActive)
            ORDER BY m.code ASC
            """)
    List<Major> search(String keyword, UUID departmentId, Boolean isActive);
}

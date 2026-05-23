package com.quanlydaotao.backend.role.repository;

import com.quanlydaotao.backend.role.entity.Permission;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Repository
public interface PermissionRepository extends JpaRepository<Permission, UUID> {
    Optional<Permission> findByCode(String code);

    @Query("""
            SELECT p
            FROM Permission p
            WHERE (:module IS NULL OR LOWER(p.module) = LOWER(CAST(:module AS String)))
              AND (:keyword IS NULL OR LOWER(p.code) LIKE LOWER(CONCAT('%', CAST(:keyword AS String), '%'))
                   OR LOWER(p.name) LIKE LOWER(CONCAT('%', CAST(:keyword AS String), '%')))
            ORDER BY p.module ASC, p.code ASC
            """)
    List<Permission> search(String module, String keyword);
}


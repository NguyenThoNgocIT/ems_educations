package com.quanlydaotao.backend.role.repository;

import com.quanlydaotao.backend.role.entity.PermissionApiId;
import com.quanlydaotao.backend.role.entity.PermissionApis;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface PermissionApiRepository extends JpaRepository<PermissionApis, PermissionApiId> {
    List<PermissionApis> findByIsActiveTrue();

    @Query("""
            SELECT pa
            FROM PermissionApis pa
            JOIN FETCH pa.permission p
            WHERE pa.isActive = true
              AND p.isActive = true
            """)
    List<PermissionApis> findActiveWithPermission();

    List<PermissionApis> findByPermissionPermissionIdAndIsActiveTrue(java.util.UUID permissionId);
}

package com.quanlydaotao.backend.role.repository;

import com.quanlydaotao.backend.role.entity.RolePermissions;
import com.quanlydaotao.backend.role.entity.RolePermissionId;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.UUID;

@Repository
public interface RolePermissionRepository extends JpaRepository<RolePermissions, RolePermissionId> {
    List<RolePermissions> findByRoleRoleId(UUID roleId);

    @Query("""
            SELECT DISTINCT rp
            FROM RolePermissions rp
            JOIN FETCH rp.permission p
            WHERE rp.role.roleId = :roleId
              AND rp.isActive = true
              AND p.isActive = true
            """)
    List<RolePermissions> findActiveByRoleId(@Param("roleId") UUID roleId);

    @Query("""
            SELECT COUNT(rp)
            FROM RolePermissions rp
            JOIN rp.permission p
            WHERE rp.role.roleId = :roleId
              AND rp.isActive = true
              AND p.isActive = true
            """)
    long countActiveByRoleId(@Param("roleId") UUID roleId);

    @Query("""
            SELECT DISTINCT p.code
            FROM UserRole ur
            JOIN ur.role r
            JOIN RolePermissions rp ON rp.role.roleId = r.roleId
            JOIN rp.permission p
            WHERE ur.user.userId = :userId
              AND ur.isActive = true
              AND r.isActive = true
              AND rp.isActive = true
              AND p.isActive = true
            """)
    List<String> findActivePermissionCodesByUserId(@Param("userId") UUID userId);
}


package com.quanlydaotao.backend.role.repository;

import com.quanlydaotao.backend.role.entity.RolePermissions;
import com.quanlydaotao.backend.role.entity.RolePermissionId;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.UUID;

@Repository
public interface RolePermissionRepository extends JpaRepository<RolePermissions, RolePermissionId> {
    List<RolePermissions> findByRoleRoleId(UUID roleId);
}


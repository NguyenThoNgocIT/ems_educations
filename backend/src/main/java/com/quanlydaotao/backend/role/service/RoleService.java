package com.quanlydaotao.backend.role.service;
import com.quanlydaotao.backend.role.dto.RoleDto;
import com.quanlydaotao.backend.role.dto.PermissionDto;
import java.util.List;
import java.util.UUID;
public interface RoleService {
    List<RoleDto> getAllRoles();
    RoleDto getRoleById(UUID id);
    RoleDto createRole(RoleDto request);
    RoleDto updateRole(UUID id, RoleDto request);
    void deleteRole(UUID id);
    List<PermissionDto> getRolePermissions(UUID roleId);
    RoleDto assignPermissions(UUID roleId, List<UUID> permissionIds);
}

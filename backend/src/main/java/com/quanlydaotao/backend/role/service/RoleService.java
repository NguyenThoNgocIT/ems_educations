package com.quanlydaotao.backend.role.service;

import com.quanlydaotao.backend.role.dto.RoleDto;
import java.util.List;
import java.util.UUID;
public interface RoleService {
    
    RoleResponse createRole(CreateRoleRequest request);
    
    RoleResponse updateRole(String roleId, UpdateRoleRequest request);
    
    RoleResponse getRoleById(String roleId);
    
    Page<RoleResponse> getAllRoles(Pageable pageable);
    
    void deleteRole(String roleId);
}
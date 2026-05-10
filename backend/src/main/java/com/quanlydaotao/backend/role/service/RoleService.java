package com.quanlydaotao.backend.role.service;

import com.quanlydaotao.backend.role.dto.request.CreateRoleRequest;
import com.quanlydaotao.backend.role.dto.request.UpdateRoleRequest;
import com.quanlydaotao.backend.role.dto.response.RoleResponse;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

public interface RoleService {
    
    RoleResponse createRole(CreateRoleRequest request);
    
    RoleResponse updateRole(String roleId, UpdateRoleRequest request);
    
    RoleResponse getRoleById(String roleId);
    
    Page<RoleResponse> getAllRoles(Pageable pageable);
    
    void deleteRole(String roleId);
}
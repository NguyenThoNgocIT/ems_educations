package com.quanlydaotao.backend.role.mapper;

import com.quanlydaotao.backend.role.dto.request.CreateRoleRequest;
import com.quanlydaotao.backend.role.dto.request.UpdateRoleRequest;
import com.quanlydaotao.backend.role.dto.response.RoleResponse;
import com.quanlydaotao.backend.role.entity.Role;
import org.springframework.stereotype.Component;

import java.util.UUID;

@Component
public class RoleMapper {

    public Role toEntity(CreateRoleRequest request) {
        if (request == null) return null;
        
        Role role = new Role();
        role.setCode(request.getCode());
        role.setName(request.getName());
        role.setDescription(request.getDescription());
        role.setLevel(request.getLevel());
        role.setIsSystem(request.getIsSystem() != null ? request.getIsSystem() : false);
        role.setDisplayOrder(request.getDisplayOrder());
        role.setColor(request.getColor());
        role.setIsActive(true);
        return role;
    }

    public void updateEntity(UpdateRoleRequest request, Role role) {
        if (request == null) return;
        if (request.getCode() != null) role.setCode(request.getCode());
        if (request.getName() != null) role.setName(request.getName());
        if (request.getDescription() != null) role.setDescription(request.getDescription());
        if (request.getLevel() != null) role.setLevel(request.getLevel());
        if (request.getIsSystem() != null) role.setIsSystem(request.getIsSystem());
        if (request.getDisplayOrder() != null) role.setDisplayOrder(request.getDisplayOrder());
        if (request.getColor() != null) role.setColor(request.getColor());
        if (request.getIsActive() != null) role.setIsActive(request.getIsActive());
    }

    public RoleResponse toResponse(Role role) {
        if (role == null) return null;
        
        return RoleResponse.builder()
                .roleId(role.getRoleId() != null ? role.getRoleId().toString() : null)
                .code(role.getCode())
                .name(role.getName())
                .description(role.getDescription())
                .level(role.getLevel())
                .isSystem(role.getIsSystem())
                .displayOrder(role.getDisplayOrder())
                .color(role.getColor())
                .isActive(role.getIsActive())
                .build();
    }
}
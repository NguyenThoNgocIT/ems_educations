package com.quanlydaotao.backend.role.service.impl;

import com.quanlydaotao.backend.common.exception.BusinessException;
import com.quanlydaotao.backend.common.exception.ResourceNotFoundException;
import com.quanlydaotao.backend.role.dto.PermissionDto;
import com.quanlydaotao.backend.role.dto.RoleDto;
import com.quanlydaotao.backend.role.entity.Permission;
import com.quanlydaotao.backend.role.entity.Role;
import com.quanlydaotao.backend.role.entity.RolePermissionId;
import com.quanlydaotao.backend.role.entity.RolePermissions;
import com.quanlydaotao.backend.role.mapper.RoleMapper;
import com.quanlydaotao.backend.role.repository.PermissionRepository;
import com.quanlydaotao.backend.role.repository.RolePermissionRepository;
import com.quanlydaotao.backend.role.repository.RoleRepository;
import com.quanlydaotao.backend.role.service.RoleService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor
@Transactional
public class RoleServiceImpl implements RoleService {

    private final RoleRepository roleRepository;
    private final PermissionRepository permissionRepository;
    private final RolePermissionRepository rolePermissionRepository;
    private final RoleMapper roleMapper;

    @Override
    public List<RoleDto> getAllRoles() {
        return roleMapper.toDtoList(roleRepository.findAll());
    }

    @Override
    public RoleDto getRoleById(UUID id) {
        Role role = roleRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Không tìm thấy vai trò"));
        return toDtoWithPermissions(role);
    }

    @Override
    public RoleDto createRole(RoleDto request) {
        if (roleRepository.findByCode(request.getCode()).isPresent()) {
            throw new BusinessException("Mã vai trò đã tồn tại");
        }
        Role role = roleMapper.toEntity(request);
        if (role.getIsActive() == null) {
            role.setIsActive(true);
        }
        return toDtoWithPermissions(roleRepository.save(role));
    }

    @Override
    public RoleDto updateRole(UUID id, RoleDto request) {
        Role role = roleRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Không tìm thấy vai trò"));
        if (request.getCode() != null) {
            roleRepository.findByCode(request.getCode())
                    .filter(existing -> !existing.getRoleId().equals(id))
                    .ifPresent(existing -> {
                        throw new BusinessException("Mã vai trò đã tồn tại");
                    });
        }
        roleMapper.updateEntityFromDto(request, role);
        return toDtoWithPermissions(roleRepository.save(role));
    }

    @Override
    public void deleteRole(UUID id) {
        Role role = roleRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Không tìm thấy vai trò"));
        role.setIsActive(false);
        roleRepository.save(role);
    }

    @Override
    @Transactional(readOnly = true)
    public List<PermissionDto> getRolePermissions(UUID roleId) {
        findRole(roleId);
        return rolePermissionRepository.findActiveByRoleId(roleId).stream()
                .map(RolePermissions::getPermission)
                .map(this::toPermissionDto)
                .toList();
    }

    @Override
    public RoleDto assignPermissions(UUID roleId, List<UUID> permissionIds) {
        Role role = findRole(roleId);
        rolePermissionRepository.findByRoleRoleId(roleId).forEach(rolePermission -> {
            rolePermission.setIsActive(false);
            rolePermissionRepository.save(rolePermission);
        });

        if (permissionIds != null) {
            for (UUID permissionId : permissionIds) {
                Permission permission = permissionRepository.findById(permissionId)
                        .orElseThrow(() -> new ResourceNotFoundException("Không tìm thấy quyền"));
                RolePermissionId id = new RolePermissionId(roleId, permissionId);
                RolePermissions rolePermission = rolePermissionRepository.findById(id).orElseGet(RolePermissions::new);
                rolePermission.setId(id);
                rolePermission.setRole(role);
                rolePermission.setPermission(permission);
                rolePermission.setIsActive(true);
                rolePermissionRepository.save(rolePermission);
            }
        }
        return toDtoWithPermissions(role);
    }

    private Role findRole(UUID roleId) {
        return roleRepository.findById(roleId)
                .orElseThrow(() -> new ResourceNotFoundException("Không tìm thấy vai trò"));
    }

    private RoleDto toDtoWithPermissions(Role role) {
        RoleDto dto = roleMapper.toDto(role);
        dto.setPermissions(getRolePermissions(role.getRoleId()));
        return dto;
    }

    private PermissionDto toPermissionDto(Permission permission) {
        PermissionDto dto = new PermissionDto();
        dto.setPermissionId(permission.getPermissionId());
        dto.setCode(permission.getCode());
        dto.setName(permission.getName());
        dto.setDescription(permission.getDescription());
        dto.setModule(permission.getModule());
        dto.setIsActive(permission.getIsActive());
        dto.setCreatedAt(permission.getCreatedAt());
        dto.setUpdatedAt(permission.getUpdatedAt());
        return dto;
    }
}

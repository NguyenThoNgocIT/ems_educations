package com.quanlydaotao.backend.role.service.impl;

import com.quanlydaotao.backend.common.exception.BusinessException;
import com.quanlydaotao.backend.common.exception.ResourceNotFoundException;
import com.quanlydaotao.backend.role.dto.request.CreateRoleRequest;
import com.quanlydaotao.backend.role.dto.request.UpdateRoleRequest;
import com.quanlydaotao.backend.role.dto.response.RoleResponse;
import com.quanlydaotao.backend.role.entity.Role;
import com.quanlydaotao.backend.role.mapper.RoleMapper;
import com.quanlydaotao.backend.role.repository.RoleRepository;
import com.quanlydaotao.backend.role.service.RoleService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class RoleServiceImpl implements RoleService {

    private final RoleRepository roleRepository;
    private final RoleMapper roleMapper;

    @Override
    @Transactional
    public RoleResponse createRole(CreateRoleRequest request) {
        if (roleRepository.existsByCode(request.getCode())) {
            throw new BusinessException("Mã vai trò đã tồn tại: " + request.getCode());
        }
        
        Role role = roleMapper.toEntity(request);
        role = roleRepository.save(role);
        return roleMapper.toResponse(role);
    }

    @Override
    @Transactional
    public RoleResponse updateRole(String roleId, UpdateRoleRequest request) {
        Role role = roleRepository.findById(UUID.fromString(roleId))
                .orElseThrow(() -> new ResourceNotFoundException("Không tìm thấy vai trò với ID: " + roleId));
        
        if (request.getCode() != null && !request.getCode().equals(role.getCode())) {
            if (roleRepository.existsByCode(request.getCode())) {
                throw new BusinessException("Mã vai trò đã tồn tại: " + request.getCode());
            }
        }
        
        roleMapper.updateEntity(request, role);
        role = roleRepository.save(role);
        return roleMapper.toResponse(role);
    }

    @Override
    @Transactional(readOnly = true)
    public RoleResponse getRoleById(String roleId) {
        Role role = roleRepository.findById(UUID.fromString(roleId))
                .orElseThrow(() -> new ResourceNotFoundException("Không tìm thấy vai trò với ID: " + roleId));
        return roleMapper.toResponse(role);
    }

    @Override
    @Transactional(readOnly = true)
    public Page<RoleResponse> getAllRoles(Pageable pageable) {
        return roleRepository.findAll(pageable).map(roleMapper::toResponse);
    }

    @Override
    @Transactional
    public void deleteRole(String roleId) {
        Role role = roleRepository.findById(UUID.fromString(roleId))
                .orElseThrow(() -> new ResourceNotFoundException("Không tìm thấy vai trò với ID: " + roleId));
        role.setDeletedAt(LocalDateTime.now());
        role.setIsActive(false);
        roleRepository.save(role);
    }
}
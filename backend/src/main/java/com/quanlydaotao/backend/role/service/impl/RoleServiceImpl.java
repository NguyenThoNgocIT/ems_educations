package com.quanlydaotao.backend.role.service.impl;

import com.quanlydaotao.backend.role.dto.RoleDto;
import com.quanlydaotao.backend.role.entity.Role;
import com.quanlydaotao.backend.role.mapper.RoleMapper;
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
    private final RoleMapper roleMapper;

    @Override
    public List<RoleDto> getAllRoles() {
        return roleMapper.toDtoList(roleRepository.findAll());
    }

    @Override
    public RoleDto getRoleById(UUID id) {
        Role role = roleRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Role not found with id: " + id));
        return roleMapper.toDto(role);
    }

    @Override
    public RoleDto createRole(RoleDto request) {
        Role role = roleMapper.toEntity(request);
        return roleMapper.toDto(roleRepository.save(role));
    }

    @Override
    public RoleDto updateRole(UUID id, RoleDto request) {
        Role role = roleRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Role not found with id: " + id));
        roleMapper.updateEntityFromDto(request, role);
        return roleMapper.toDto(roleRepository.save(role));
    }

    @Override
    public void deleteRole(UUID id) {
        Role role = roleRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Role not found with id: " + id));
        roleRepository.delete(role);
    }
}

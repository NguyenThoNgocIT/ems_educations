package com.quanlydaotao.backend.role.service.impl;

import com.quanlydaotao.backend.common.exception.BusinessException;
import com.quanlydaotao.backend.common.exception.ResourceNotFoundException;
import com.quanlydaotao.backend.role.dto.PermissionApiDto;
import com.quanlydaotao.backend.role.dto.PermissionDto;
import com.quanlydaotao.backend.role.entity.Permission;
import com.quanlydaotao.backend.role.entity.PermissionApiId;
import com.quanlydaotao.backend.role.entity.PermissionApis;
import com.quanlydaotao.backend.role.repository.PermissionApiRepository;
import com.quanlydaotao.backend.role.repository.PermissionRepository;
import com.quanlydaotao.backend.role.service.PermissionService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.util.StringUtils;

import java.util.List;
import java.util.Locale;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class PermissionServiceImpl implements PermissionService {
    private final PermissionRepository permissionRepository;
    private final PermissionApiRepository permissionApiRepository;

    @Override
    @Transactional(readOnly = true)
    public List<PermissionDto> searchPermissions(String module, String keyword) {
        return permissionRepository.search(normalizeBlank(module), normalizeBlank(keyword)).stream()
                .map(this::toDto)
                .toList();
    }

    @Override
    @Transactional(readOnly = true)
    public PermissionDto getPermission(UUID id) {
        return toDto(findPermission(id));
    }

    @Override
    @Transactional
    public PermissionDto createPermission(PermissionDto request) {
        validatePermissionRequest(request);
        String code = normalizeCode(request.getCode());
        permissionRepository.findByCode(code).ifPresent(existing -> {
            throw new BusinessException("Mã quyền đã tồn tại");
        });
        Permission permission = new Permission();
        permission.setCode(code);
        apply(permission, request);
        return toDto(permissionRepository.save(permission));
    }

    @Override
    @Transactional
    public PermissionDto updatePermission(UUID id, PermissionDto request) {
        Permission permission = findPermission(id);
        if (StringUtils.hasText(request.getCode())) {
            String code = normalizeCode(request.getCode());
            permissionRepository.findByCode(code)
                    .filter(existing -> !existing.getPermissionId().equals(id))
                    .ifPresent(existing -> {
                        throw new BusinessException("Mã quyền đã tồn tại");
                    });
            permission.setCode(code);
        }
        apply(permission, request);
        return toDto(permissionRepository.save(permission));
    }

    @Override
    @Transactional
    public void deletePermission(UUID id) {
        Permission permission = findPermission(id);
        permission.setIsActive(false);
        permissionRepository.save(permission);
    }

    @Override
    @Transactional(readOnly = true)
    public List<PermissionApiDto> getPermissionApis(UUID permissionId) {
        findPermission(permissionId);
        return permissionApiRepository.findByPermissionPermissionIdAndIsActiveTrue(permissionId).stream()
                .map(this::toApiDto)
                .toList();
    }

    @Override
    @Transactional
    public PermissionApiDto createPermissionApi(PermissionApiDto request) {
        if (request.getPermissionId() == null) {
            throw new BusinessException("Quyền không được để trống");
        }
        if (!StringUtils.hasText(request.getApiPath()) || !StringUtils.hasText(request.getHttpMethod())) {
            throw new BusinessException("Đường dẫn API và HTTP method không được để trống");
        }
        Permission permission = findPermission(request.getPermissionId());
        PermissionApiId id = new PermissionApiId(
                permission.getPermissionId(),
                request.getApiPath().trim(),
                request.getHttpMethod().trim().toUpperCase(Locale.ROOT)
        );
        PermissionApis permissionApi = permissionApiRepository.findById(id).orElseGet(PermissionApis::new);
        permissionApi.setId(id);
        permissionApi.setPermission(permission);
        permissionApi.setDescription(request.getDescription());
        permissionApi.setIsActive(request.getIsActive() == null || request.getIsActive());
        return toApiDto(permissionApiRepository.save(permissionApi));
    }

    @Override
    @Transactional
    public void deletePermissionApi(UUID permissionId, String apiPath, String httpMethod) {
        PermissionApis permissionApi = permissionApiRepository.findById(
                        new PermissionApiId(permissionId, apiPath, httpMethod.toUpperCase(Locale.ROOT)))
                .orElseThrow(() -> new ResourceNotFoundException("Không tìm thấy mapping quyền API"));
        permissionApi.setIsActive(false);
        permissionApiRepository.save(permissionApi);
    }

    private Permission findPermission(UUID id) {
        return permissionRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Không tìm thấy quyền"));
    }

    private void validatePermissionRequest(PermissionDto request) {
        if (!StringUtils.hasText(request.getCode()) || !StringUtils.hasText(request.getName())) {
            throw new BusinessException("Mã quyền và tên quyền không được để trống");
        }
    }

    private void apply(Permission permission, PermissionDto request) {
        if (request.getName() != null) permission.setName(request.getName());
        if (request.getDescription() != null) permission.setDescription(request.getDescription());
        if (request.getModule() != null) permission.setModule(request.getModule());
        if (request.getIsActive() != null) permission.setIsActive(request.getIsActive());
    }

    private PermissionDto toDto(Permission permission) {
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

    private PermissionApiDto toApiDto(PermissionApis permissionApi) {
        PermissionApiDto dto = new PermissionApiDto();
        dto.setPermissionId(permissionApi.getPermission().getPermissionId());
        dto.setPermissionCode(permissionApi.getPermission().getCode());
        dto.setApiPath(permissionApi.getId().getApiPath());
        dto.setHttpMethod(permissionApi.getId().getHttpMethod());
        dto.setDescription(permissionApi.getDescription());
        dto.setIsActive(permissionApi.getIsActive());
        return dto;
    }

    private String normalizeCode(String code) {
        return code.trim().toUpperCase(Locale.ROOT);
    }

    private String normalizeBlank(String value) {
        return StringUtils.hasText(value) ? value.trim() : null;
    }
}

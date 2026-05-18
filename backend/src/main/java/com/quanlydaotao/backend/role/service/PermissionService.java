package com.quanlydaotao.backend.role.service;

import com.quanlydaotao.backend.role.dto.PermissionApiDto;
import com.quanlydaotao.backend.role.dto.PermissionDto;

import java.util.List;
import java.util.UUID;

public interface PermissionService {
    List<PermissionDto> searchPermissions(String module, String keyword);
    PermissionDto getPermission(UUID id);
    PermissionDto createPermission(PermissionDto request);
    PermissionDto updatePermission(UUID id, PermissionDto request);
    void deletePermission(UUID id);
    List<PermissionApiDto> getPermissionApis(UUID permissionId);
    PermissionApiDto createPermissionApi(PermissionApiDto request);
    void deletePermissionApi(UUID permissionId, String apiPath, String httpMethod);
}

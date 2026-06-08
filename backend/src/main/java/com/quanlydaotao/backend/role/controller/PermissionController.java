package com.quanlydaotao.backend.role.controller;
import com.quanlydaotao.backend.common.dto.ApiResponse;
import com.quanlydaotao.backend.role.dto.PermissionApiDto;
import com.quanlydaotao.backend.role.dto.PermissionDto;
import com.quanlydaotao.backend.role.service.PermissionService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/v1/permissions")
@RequiredArgsConstructor
@Tag(name = "Quản lý quyền", description = "API quản trị permissions và mapping quyền với API")
public class PermissionController {
    private final PermissionService permissionService;

    @GetMapping("/admin")
    @PreAuthorize("hasAnyAuthority('ROLE_ADMIN','ROLE_SUPER_ADMIN','PERMISSION_VIEW')")
    @Operation(summary = "Admin lấy danh sách quyền")
    public ResponseEntity<ApiResponse<List<PermissionDto>>> searchPermissions(
            @RequestParam(required = false) String module,
            @RequestParam(required = false) String keyword) {
        return ResponseEntity.ok(ApiResponse.success("Lấy danh sách quyền thành công", permissionService.searchPermissions(module, keyword)));
    }

    @GetMapping("/admin/{id}")
    @PreAuthorize("hasAnyAuthority('ROLE_ADMIN','ROLE_SUPER_ADMIN','PERMISSION_VIEW')")
    @Operation(summary = "Admin lấy chi tiết quyền")
    public ResponseEntity<ApiResponse<PermissionDto>> getPermission(@PathVariable UUID id) {
        return ResponseEntity.ok(ApiResponse.success("Lấy quyền thành công", permissionService.getPermission(id)));
    }

    @PostMapping("/admin")
    @PreAuthorize("hasAnyAuthority('ROLE_ADMIN','ROLE_SUPER_ADMIN','PERMISSION_CREATE')")
    @Operation(summary = "Admin tạo quyền")
    public ResponseEntity<ApiResponse<PermissionDto>> createPermission(@RequestBody PermissionDto request) {
        return ResponseEntity.ok(ApiResponse.success("Tạo quyền thành công", permissionService.createPermission(request)));
    }

    @PutMapping("/admin/{id}")
    @PreAuthorize("hasAnyAuthority('ROLE_ADMIN','ROLE_SUPER_ADMIN','PERMISSION_EDIT')")
    @Operation(summary = "Admin cập nhật quyền")
    public ResponseEntity<ApiResponse<PermissionDto>> updatePermission(@PathVariable UUID id, @RequestBody PermissionDto request) {
        return ResponseEntity.ok(ApiResponse.success("Cập nhật quyền thành công", permissionService.updatePermission(id, request)));
    }

    @DeleteMapping("/admin/{id}")
    @PreAuthorize("hasAnyAuthority('ROLE_ADMIN','ROLE_SUPER_ADMIN','PERMISSION_DELETE')")
    @Operation(summary = "Admin xóa mềm quyền")
    public ResponseEntity<ApiResponse<Void>> deletePermission(@PathVariable UUID id) {
        permissionService.deletePermission(id);
        return ResponseEntity.ok(ApiResponse.success("Xóa quyền thành công", null));
    }

    @GetMapping("/admin/{id}/apis")
    @PreAuthorize("hasAnyAuthority('ROLE_ADMIN','ROLE_SUPER_ADMIN','PERMISSION_VIEW','PERMISSION_API_VIEW')")
    @Operation(summary = "Admin xem mapping API của quyền")
    public ResponseEntity<ApiResponse<List<PermissionApiDto>>> getPermissionApis(@PathVariable UUID id) {
        return ResponseEntity.ok(ApiResponse.success("Lấy mapping API của quyền thành công", permissionService.getPermissionApis(id)));
    }

    @PostMapping("/admin/apis")
    @PreAuthorize("hasAnyAuthority('ROLE_ADMIN','ROLE_SUPER_ADMIN','PERMISSION_EDIT','PERMISSION_API_EDIT')")
    @Operation(summary = "Admin tạo mapping quyền với API")
    public ResponseEntity<ApiResponse<PermissionApiDto>> createPermissionApi(@RequestBody PermissionApiDto request) {
        return ResponseEntity.ok(ApiResponse.success("Tạo mapping quyền API thành công", permissionService.createPermissionApi(request)));
    }

    @DeleteMapping("/admin/{permissionId}/apis")
    @PreAuthorize("hasAnyAuthority('ROLE_ADMIN','ROLE_SUPER_ADMIN','PERMISSION_EDIT','PERMISSION_API_EDIT')")
    @Operation(summary = "Admin xóa mềm mapping quyền với API")
    public ResponseEntity<ApiResponse<Void>> deletePermissionApi(
            @PathVariable UUID permissionId,
            @RequestParam String apiPath,
            @RequestParam String httpMethod) {
        permissionService.deletePermissionApi(permissionId, apiPath, httpMethod);
        return ResponseEntity.ok(ApiResponse.success("Xóa mapping quyền API thành công", null));
    }
}

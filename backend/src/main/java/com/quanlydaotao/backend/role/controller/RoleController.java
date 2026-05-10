package com.quanlydaotao.backend.role.controller;

import com.quanlydaotao.backend.common.dto.ApiResponse;
import com.quanlydaotao.backend.role.dto.request.CreateRoleRequest;
import com.quanlydaotao.backend.role.dto.request.UpdateRoleRequest;
import com.quanlydaotao.backend.role.dto.response.RoleResponse;
import com.quanlydaotao.backend.role.service.RoleService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.web.PageableDefault;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/v1/roles")
@RequiredArgsConstructor
@Tag(name = "Role Management", description = "APIs for managing roles")
public class RoleController {

    private final RoleService roleService;

    @PostMapping
    @Operation(summary = "Create new role")
    public ResponseEntity<ApiResponse<RoleResponse>> createRole(@Valid @RequestBody CreateRoleRequest request) {
        RoleResponse response = roleService.createRole(request);
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.success("Tạo vai trò thành công", response));
    }

    @GetMapping
    @Operation(summary = "Get all roles")
    public ResponseEntity<ApiResponse<Page<RoleResponse>>> getAllRoles(@PageableDefault(size = 10) Pageable pageable) {
        Page<RoleResponse> response = roleService.getAllRoles(pageable);
        return ResponseEntity.ok(ApiResponse.success(response));
    }

    @GetMapping("/{id}")
    @Operation(summary = "Get role by ID")
    public ResponseEntity<ApiResponse<RoleResponse>> getRoleById(@PathVariable String id) {
        RoleResponse response = roleService.getRoleById(id);
        return ResponseEntity.ok(ApiResponse.success(response));
    }

    @PutMapping("/{id}")
    @Operation(summary = "Update role")
    public ResponseEntity<ApiResponse<RoleResponse>> updateRole(@PathVariable String id, @Valid @RequestBody UpdateRoleRequest request) {
        RoleResponse response = roleService.updateRole(id, request);
        return ResponseEntity.ok(ApiResponse.success("Cập nhật vai trò thành công", response));
    }

    @DeleteMapping("/{id}")
    @Operation(summary = "Delete role (soft delete)")
    public ResponseEntity<ApiResponse<Void>> deleteRole(@PathVariable String id) {
        roleService.deleteRole(id);
        return ResponseEntity.ok(ApiResponse.success("Xóa vai trò thành công", null));
    }
}
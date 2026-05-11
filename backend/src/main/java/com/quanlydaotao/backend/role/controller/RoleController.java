package com.quanlydaotao.backend.role.controller;

import com.quanlydaotao.backend.common.dto.ApiResponse;
import com.quanlydaotao.backend.role.dto.RoleDto;
import com.quanlydaotao.backend.role.service.RoleService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/v1/roles")
@RequiredArgsConstructor
@Tag(name = "Quản lý Vai trò", description = "Các API liên quan đến quản lý vai trò và phân quyền")
public class RoleController {

    private final RoleService roleService;

    @GetMapping
    @Operation(summary = "Lấy tất cả vai trò", description = "Trả về danh sách toàn bộ các vai trò trong hệ thống")
    public ResponseEntity<ApiResponse<List<RoleDto>>> getAllRoles() {
        return ResponseEntity.ok(ApiResponse.success("Lấy danh sách vai trò thành công", roleService.getAllRoles()));
    }

    @GetMapping("/{id}")
    @Operation(summary = "Lấy chi tiết vai trò", description = "Trả về thông tin chi tiết của một vai trò theo ID")
    public ResponseEntity<ApiResponse<RoleDto>> getRoleById(@PathVariable UUID id) {
        return ResponseEntity.ok(ApiResponse.success("Lấy thông tin vai trò thành công", roleService.getRoleById(id)));
    }

    @PostMapping
    @Operation(summary = "Tạo vai trò mới", description = "Tạo một vai trò mới trong hệ thống")
    public ResponseEntity<ApiResponse<RoleDto>> createRole(@RequestBody RoleDto request) {
        return ResponseEntity.ok(ApiResponse.success("Tạo vai trò thành công", roleService.createRole(request)));
    }

    @PutMapping("/{id}")
    @Operation(summary = "Cập nhật vai trò", description = "Cập nhật thông tin vai trò đã tồn tại")
    public ResponseEntity<ApiResponse<RoleDto>> updateRole(@PathVariable UUID id, @RequestBody RoleDto request) {
        return ResponseEntity.ok(ApiResponse.success("Cập nhật vai trò thành công", roleService.updateRole(id, request)));
    }

    @DeleteMapping("/{id}")
    @Operation(summary = "Xóa vai trò", description = "Xóa vai trò khỏi hệ thống theo ID")
    public ResponseEntity<ApiResponse<Void>> deleteRole(@PathVariable UUID id) {
        roleService.deleteRole(id);
        return ResponseEntity.ok(ApiResponse.success("Xóa vai trò thành công", null));
    }
}

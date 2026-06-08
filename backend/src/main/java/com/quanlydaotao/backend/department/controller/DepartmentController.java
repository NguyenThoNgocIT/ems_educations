package com.quanlydaotao.backend.department.controller;

import com.quanlydaotao.backend.common.dto.ApiResponse;
import com.quanlydaotao.backend.department.dto.DepartmentDto;
import com.quanlydaotao.backend.department.service.DepartmentService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/v1/departments")
@RequiredArgsConstructor
@Tag(name = "Quản lý khoa", description = "API admin quản lý khoa/bộ môn")
public class DepartmentController {

    private final DepartmentService departmentService;

    @GetMapping("/admin")
    @PreAuthorize("hasAnyRole('ADMIN','SUPER_ADMIN') or @rbacPermissionEvaluator.hasCurrentRequestPermission(authentication)")
    @Operation(summary = "Admin lấy danh sách khoa")
    public ResponseEntity<ApiResponse<List<DepartmentDto>>> searchDepartments(
            @RequestParam(required = false) String keyword,
            @RequestParam(required = false) Boolean isActive) {
        return ResponseEntity.ok(ApiResponse.success("Lấy danh sách khoa thành công", departmentService.searchDepartments(keyword, isActive)));
    }

    @GetMapping("/admin/{id}")
    @PreAuthorize("hasAnyRole('ADMIN','SUPER_ADMIN') or @rbacPermissionEvaluator.hasCurrentRequestPermission(authentication)")
    @Operation(summary = "Admin lấy chi tiết khoa")
    public ResponseEntity<ApiResponse<DepartmentDto>> getDepartment(@PathVariable UUID id) {
        return ResponseEntity.ok(ApiResponse.success("Lấy khoa thành công", departmentService.getDepartment(id)));
    }

    @PostMapping("/admin")
    @PreAuthorize("hasAnyRole('ADMIN','SUPER_ADMIN') or @rbacPermissionEvaluator.hasCurrentRequestPermission(authentication)")
    @Operation(summary = "Admin tạo khoa")
    public ResponseEntity<ApiResponse<DepartmentDto>> createDepartment(@RequestBody DepartmentDto request) {
        return ResponseEntity.ok(ApiResponse.success("Tạo khoa thành công", departmentService.createDepartment(request)));
    }

    @PutMapping("/admin/{id}")
    @PreAuthorize("hasAnyRole('ADMIN','SUPER_ADMIN') or @rbacPermissionEvaluator.hasCurrentRequestPermission(authentication)")
    @Operation(summary = "Admin cập nhật khoa")
    public ResponseEntity<ApiResponse<DepartmentDto>> updateDepartment(@PathVariable UUID id, @RequestBody DepartmentDto request) {
        return ResponseEntity.ok(ApiResponse.success("Cập nhật khoa thành công", departmentService.updateDepartment(id, request)));
    }

    @DeleteMapping("/admin/{id}")
    @PreAuthorize("hasAnyRole('ADMIN','SUPER_ADMIN') or @rbacPermissionEvaluator.hasCurrentRequestPermission(authentication)")
    @Operation(summary = "Admin xóa mềm khoa")
    public ResponseEntity<ApiResponse<Void>> deleteDepartment(@PathVariable UUID id) {
        departmentService.deleteDepartment(id);
        return ResponseEntity.ok(ApiResponse.success("Xóa khoa thành công", null));
    }
}

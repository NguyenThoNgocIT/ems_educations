package com.quanlydaotao.backend.department.controller;

import com.quanlydaotao.backend.common.dto.ApiResponse;
import com.quanlydaotao.backend.department.dto.request.CreateDepartmentRequest;
import com.quanlydaotao.backend.department.dto.request.DepartmentSearchRequest;
import com.quanlydaotao.backend.department.dto.request.UpdateDepartmentRequest;
import com.quanlydaotao.backend.department.dto.response.DepartmentDetailResponse;
import com.quanlydaotao.backend.department.dto.response.DepartmentResponse;
import com.quanlydaotao.backend.department.service.DepartmentService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.data.web.PageableDefault;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.UUID;

@RestController
@RequestMapping("/api/v1/departments")
@RequiredArgsConstructor
@Tag(name = "Department Management", description = "APIs for managing departments")
public class DepartmentController {

    private final DepartmentService departmentService;

    @PostMapping
    @Operation(summary = "Create new department")
    public ResponseEntity<ApiResponse<DepartmentResponse>> createDepartment(@Valid @RequestBody CreateDepartmentRequest request) {
        DepartmentResponse response = departmentService.createDepartment(request);
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.success("Tạo khoa thành công", response));
    }

    @GetMapping("/{id}")
    @Operation(summary = "Get department by ID")
    public ResponseEntity<ApiResponse<DepartmentDetailResponse>> getDepartmentById(@PathVariable UUID id) {
        DepartmentDetailResponse response = departmentService.getDepartmentById(id);
        return ResponseEntity.ok(ApiResponse.success(response));
    }

    @GetMapping
    @Operation(summary = "Search departments with pagination")
    public ResponseEntity<ApiResponse<Page<DepartmentResponse>>> searchDepartments(
            @ModelAttribute DepartmentSearchRequest request,
            @PageableDefault(size = 10, sort = "code", direction = Sort.Direction.ASC) Pageable pageable) {
        Page<DepartmentResponse> response = departmentService.searchDepartments(request, pageable);
        return ResponseEntity.ok(ApiResponse.success(response));
    }

    @PutMapping("/{id}")
    @Operation(summary = "Update department")
    public ResponseEntity<ApiResponse<DepartmentResponse>> updateDepartment(
            @PathVariable UUID id,
            @Valid @RequestBody UpdateDepartmentRequest request) {
        DepartmentResponse response = departmentService.updateDepartment(id, request);
        return ResponseEntity.ok(ApiResponse.success("Cập nhật khoa thành công", response));
    }

    @DeleteMapping("/{id}")
    @Operation(summary = "Delete department (soft delete)")
    public ResponseEntity<ApiResponse<Void>> deleteDepartment(@PathVariable UUID id) {
        departmentService.deleteDepartment(id);
        return ResponseEntity.ok(ApiResponse.success("Xóa khoa thành công", null));
    }
}
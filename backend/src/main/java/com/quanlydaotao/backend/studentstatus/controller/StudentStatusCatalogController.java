package com.quanlydaotao.backend.studentstatus.controller;

import com.quanlydaotao.backend.common.dto.ApiResponse;
import com.quanlydaotao.backend.studentstatus.dto.StudentStatusCatalogRequest;
import com.quanlydaotao.backend.studentstatus.dto.StudentStatusCatalogResponse;
import com.quanlydaotao.backend.studentstatus.service.StudentStatusCatalogService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/v1/student-status-catalog")
@RequiredArgsConstructor
@Tag(name = "Quản lý danh mục trạng thái sinh viên", description = "API admin quản lý các loại trạng thái có thể gán cho sinh viên")
public class StudentStatusCatalogController {
    private final StudentStatusCatalogService studentStatusCatalogService;

    @GetMapping("/admin")
    @PreAuthorize("hasAnyRole('ADMIN','SUPER_ADMIN') or @rbacPermissionEvaluator.hasCurrentRequestPermission(authentication)")
    @Operation(summary = "Admin lấy danh sách danh mục trạng thái sinh viên")
    public ResponseEntity<ApiResponse<List<StudentStatusCatalogResponse>>> search(
            @RequestParam(required = false) String keyword,
            @RequestParam(required = false) String statusType,
            @RequestParam(required = false) Boolean isActive) {
        return ResponseEntity.ok(ApiResponse.success("Lấy danh mục trạng thái sinh viên thành công",
                studentStatusCatalogService.search(keyword, statusType, isActive)));
    }

    @GetMapping("/admin/{id}")
    @PreAuthorize("hasAnyRole('ADMIN','SUPER_ADMIN') or @rbacPermissionEvaluator.hasCurrentRequestPermission(authentication)")
    @Operation(summary = "Admin lấy chi tiết danh mục trạng thái sinh viên")
    public ResponseEntity<ApiResponse<StudentStatusCatalogResponse>> get(@PathVariable UUID id) {
        return ResponseEntity.ok(ApiResponse.success("Lấy trạng thái sinh viên thành công", studentStatusCatalogService.getStatus(id)));
    }

    @PostMapping("/admin")
    @PreAuthorize("hasAnyRole('ADMIN','SUPER_ADMIN') or @rbacPermissionEvaluator.hasCurrentRequestPermission(authentication)")
    @Operation(summary = "Admin tạo danh mục trạng thái sinh viên")
    public ResponseEntity<ApiResponse<StudentStatusCatalogResponse>> create(@Valid @RequestBody StudentStatusCatalogRequest request) {
        return ResponseEntity.ok(ApiResponse.success("Tạo trạng thái sinh viên thành công", studentStatusCatalogService.createStatus(request)));
    }

    @PutMapping("/admin/{id}")
    @PreAuthorize("hasAnyRole('ADMIN','SUPER_ADMIN') or @rbacPermissionEvaluator.hasCurrentRequestPermission(authentication)")
    @Operation(summary = "Admin cập nhật danh mục trạng thái sinh viên")
    public ResponseEntity<ApiResponse<StudentStatusCatalogResponse>> update(@PathVariable UUID id,
                                                                           @RequestBody StudentStatusCatalogRequest request) {
        return ResponseEntity.ok(ApiResponse.success("Cập nhật trạng thái sinh viên thành công",
                studentStatusCatalogService.updateStatus(id, request)));
    }

    @DeleteMapping("/admin/{id}")
    @PreAuthorize("hasAnyRole('ADMIN','SUPER_ADMIN') or @rbacPermissionEvaluator.hasCurrentRequestPermission(authentication)")
    @Operation(summary = "Admin xóa mềm danh mục trạng thái sinh viên")
    public ResponseEntity<ApiResponse<Void>> delete(@PathVariable UUID id) {
        studentStatusCatalogService.deleteStatus(id);
        return ResponseEntity.ok(ApiResponse.success("Xóa trạng thái sinh viên thành công", null));
    }
}

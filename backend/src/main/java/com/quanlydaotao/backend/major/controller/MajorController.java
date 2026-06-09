package com.quanlydaotao.backend.major.controller;

import com.quanlydaotao.backend.common.dto.ApiResponse;
import com.quanlydaotao.backend.major.dto.MajorRequest;
import com.quanlydaotao.backend.major.dto.MajorResponse;
import com.quanlydaotao.backend.major.service.MajorService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/v1/majors")
@RequiredArgsConstructor
@Tag(name = "Quản lý ngành", description = "API admin quản lý ngành đào tạo thuộc khoa")
public class MajorController {
    private final MajorService majorService;

    @GetMapping("/admin")
    @PreAuthorize("hasAnyRole('ADMIN','SUPER_ADMIN') or @rbacPermissionEvaluator.hasCurrentRequestPermission(authentication)")
    @Operation(summary = "Admin lấy danh sách ngành")
    public ResponseEntity<ApiResponse<List<MajorResponse>>> getAllMajors(
            @RequestParam(required = false) String keyword,
            @RequestParam(required = false) UUID departmentId,
            @RequestParam(required = false) Boolean isActive) {
        return ResponseEntity.ok(ApiResponse.success("Lấy danh sách ngành thành công", majorService.getAllMajors(keyword, departmentId, isActive)));
    }

    @GetMapping("/admin/{id}")
    @PreAuthorize("hasAnyRole('ADMIN','SUPER_ADMIN') or @rbacPermissionEvaluator.hasCurrentRequestPermission(authentication)")
    @Operation(summary = "Admin lấy chi tiết ngành")
    public ResponseEntity<ApiResponse<MajorResponse>> getMajorById(@PathVariable UUID id) {
        return ResponseEntity.ok(ApiResponse.success("Lấy ngành thành công", majorService.getMajorById(id)));
    }

    @PostMapping("/admin")
    @PreAuthorize("hasAnyRole('ADMIN','SUPER_ADMIN') or @rbacPermissionEvaluator.hasCurrentRequestPermission(authentication)")
    @Operation(summary = "Admin tạo ngành")
    public ResponseEntity<ApiResponse<MajorResponse>> createMajor(@Valid @RequestBody MajorRequest request) {
        return ResponseEntity.ok(ApiResponse.success("Tạo ngành thành công", majorService.createMajor(request)));
    }

    @PutMapping("/admin/{id}")
    @PreAuthorize("hasAnyRole('ADMIN','SUPER_ADMIN') or @rbacPermissionEvaluator.hasCurrentRequestPermission(authentication)")
    @Operation(summary = "Admin cập nhật ngành")
    public ResponseEntity<ApiResponse<MajorResponse>> updateMajor(@PathVariable UUID id, @Valid @RequestBody MajorRequest request) {
        return ResponseEntity.ok(ApiResponse.success("Cập nhật ngành thành công", majorService.updateMajor(id, request)));
    }

    @DeleteMapping("/admin/{id}")
    @PreAuthorize("hasAnyRole('ADMIN','SUPER_ADMIN') or @rbacPermissionEvaluator.hasCurrentRequestPermission(authentication)")
    @Operation(summary = "Admin xóa mềm ngành")
    public ResponseEntity<ApiResponse<Void>> deleteMajor(@PathVariable UUID id) {
        majorService.deleteMajor(id);
        return ResponseEntity.ok(ApiResponse.success("Xóa ngành thành công", null));
    }
}

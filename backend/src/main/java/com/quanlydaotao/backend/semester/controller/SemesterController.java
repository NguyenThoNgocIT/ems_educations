package com.quanlydaotao.backend.semester.controller;

import com.quanlydaotao.backend.common.dto.ApiResponse;
import com.quanlydaotao.backend.semester.dto.SemesterRequest;
import com.quanlydaotao.backend.semester.dto.SemesterResponse;
import com.quanlydaotao.backend.semester.service.SemesterService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;  // ← THÊM DÒNG NÀY
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/v1/semesters")
@RequiredArgsConstructor
@Tag(name = "Quản lý học kỳ", description = "API admin quản lý học kỳ theo năm học")
public class SemesterController {
    private final SemesterService semesterService;

    @GetMapping("/admin")
    @PreAuthorize("hasAnyRole('ADMIN','SUPER_ADMIN') or @rbacPermissionEvaluator.hasCurrentRequestPermission(authentication)")
    @Operation(summary = "Admin lấy danh sách học kỳ")
    public ResponseEntity<ApiResponse<List<SemesterResponse>>> searchSemesters(
            @RequestParam(required = false) String keyword,
            @RequestParam(required = false) UUID schoolYearId,
            @RequestParam(required = false) Boolean status,
            @RequestParam(required = false) Boolean isActive) {
        return ResponseEntity.ok(ApiResponse.success("Lấy danh sách học kỳ thành công",
                semesterService.searchSemesters(keyword, schoolYearId, status, isActive)));
    }

    @GetMapping("/admin/{id}")
    @PreAuthorize("hasAnyRole('ADMIN','SUPER_ADMIN') or @rbacPermissionEvaluator.hasCurrentRequestPermission(authentication)")
    @Operation(summary = "Admin lấy chi tiết học kỳ")
    public ResponseEntity<ApiResponse<SemesterResponse>> getSemester(@PathVariable UUID id) {
        return ResponseEntity.ok(ApiResponse.success("Lấy học kỳ thành công", semesterService.getSemester(id)));
    }

    @PostMapping("/admin")
    @PreAuthorize("hasAnyRole('ADMIN','SUPER_ADMIN') or @rbacPermissionEvaluator.hasCurrentRequestPermission(authentication)")
    @Operation(summary = "Admin tạo học kỳ")
    public ResponseEntity<ApiResponse<SemesterResponse>> createSemester(@Valid @RequestBody SemesterRequest request) {
        return ResponseEntity.ok(ApiResponse.success("Tạo học kỳ thành công", semesterService.createSemester(request)));
    }

    @PutMapping("/admin/{id}")
    @PreAuthorize("hasAnyRole('ADMIN','SUPER_ADMIN') or @rbacPermissionEvaluator.hasCurrentRequestPermission(authentication)")
    @Operation(summary = "Admin cập nhật học kỳ")
    public ResponseEntity<ApiResponse<SemesterResponse>> updateSemester(@PathVariable UUID id,
                                                                        @Valid @RequestBody SemesterRequest request) {
        return ResponseEntity.ok(ApiResponse.success("Cập nhật học kỳ thành công", semesterService.updateSemester(id, request)));
    }

    @DeleteMapping("/admin/{id}")
    @PreAuthorize("hasAnyRole('ADMIN','SUPER_ADMIN') or @rbacPermissionEvaluator.hasCurrentRequestPermission(authentication)")
    @Operation(summary = "Admin xóa mềm học kỳ")
    public ResponseEntity<ApiResponse<Void>> deleteSemester(@PathVariable UUID id) {
        semesterService.deleteSemester(id);
        return ResponseEntity.ok(ApiResponse.success("Xóa học kỳ thành công", null));
    }
}
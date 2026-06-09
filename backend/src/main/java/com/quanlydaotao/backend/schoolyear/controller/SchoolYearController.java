package com.quanlydaotao.backend.schoolyear.controller;

import com.quanlydaotao.backend.common.dto.ApiResponse;
import com.quanlydaotao.backend.schoolyear.dto.SchoolYearRequest;
import com.quanlydaotao.backend.schoolyear.dto.SchoolYearResponse;
import com.quanlydaotao.backend.schoolyear.service.SchoolYearService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/v1/school-years")
@RequiredArgsConstructor
@Tag(name = "Quản lý năm học", description = "API admin quản lý năm đào tạo")
public class SchoolYearController {
    private final SchoolYearService schoolYearService;

    @GetMapping("/admin")
    @PreAuthorize("hasAnyRole('ADMIN','SUPER_ADMIN') or @rbacPermissionEvaluator.hasCurrentRequestPermission(authentication)")
    @Operation(summary = "Admin lấy danh sách năm học")
    public ResponseEntity<ApiResponse<List<SchoolYearResponse>>> searchSchoolYears(
            @RequestParam(required = false) String keyword,
            @RequestParam(required = false) Boolean isActive) {
        return ResponseEntity.ok(ApiResponse.success("Lấy danh sách năm học thành công",
                schoolYearService.searchSchoolYears(keyword, isActive)));
    }

    @GetMapping("/admin/{id}")
    @PreAuthorize("hasAnyRole('ADMIN','SUPER_ADMIN') or @rbacPermissionEvaluator.hasCurrentRequestPermission(authentication)")
    @Operation(summary = "Admin lấy chi tiết năm học")
    public ResponseEntity<ApiResponse<SchoolYearResponse>> getSchoolYear(@PathVariable UUID id) {
        return ResponseEntity.ok(ApiResponse.success("Lấy năm học thành công", schoolYearService.getSchoolYear(id)));
    }

    @PostMapping("/admin")
    @PreAuthorize("hasAnyRole('ADMIN','SUPER_ADMIN') or @rbacPermissionEvaluator.hasCurrentRequestPermission(authentication)")
    @Operation(summary = "Admin tạo năm học")
    public ResponseEntity<ApiResponse<SchoolYearResponse>> createSchoolYear(@RequestBody SchoolYearRequest request) {
        return ResponseEntity.ok(ApiResponse.success("Tạo năm học thành công", schoolYearService.createSchoolYear(request)));
    }

    @PutMapping("/admin/{id}")
    @PreAuthorize("hasAnyRole('ADMIN','SUPER_ADMIN') or @rbacPermissionEvaluator.hasCurrentRequestPermission(authentication)")
    @Operation(summary = "Admin cập nhật năm học")
    public ResponseEntity<ApiResponse<SchoolYearResponse>> updateSchoolYear(@PathVariable UUID id,
                                                                            @RequestBody SchoolYearRequest request) {
        return ResponseEntity.ok(ApiResponse.success("Cập nhật năm học thành công",
                schoolYearService.updateSchoolYear(id, request)));
    }

    @DeleteMapping("/admin/{id}")
    @PreAuthorize("hasAnyRole('ADMIN','SUPER_ADMIN') or @rbacPermissionEvaluator.hasCurrentRequestPermission(authentication)")
    @Operation(summary = "Admin xóa mềm năm học")
    public ResponseEntity<ApiResponse<Void>> deleteSchoolYear(@PathVariable UUID id) {
        schoolYearService.deleteSchoolYear(id);
        return ResponseEntity.ok(ApiResponse.success("Xóa năm học thành công", null));
    }
}

package com.quanlydaotao.backend.academiccohort.controller;

import com.quanlydaotao.backend.common.dto.ApiResponse;
import com.quanlydaotao.backend.academiccohort.dto.AcademicCohortRequest;
import com.quanlydaotao.backend.academiccohort.dto.AcademicCohortResponse;
import com.quanlydaotao.backend.academiccohort.service.AcademicCohortService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/v1/academic-cohorts")
@RequiredArgsConstructor
@Tag(name = "Quản lý niên khóa", description = "API admin quản lý niên khóa đào tạo")
public class AcademicCohortController {
    private final AcademicCohortService academicCohortService;

    @GetMapping("/admin")
    @PreAuthorize("hasAnyRole('ADMIN','SUPER_ADMIN') or @rbacPermissionEvaluator.hasCurrentRequestPermission(authentication)")
    @Operation(summary = "Admin lấy danh sách niên khóa")
    public ResponseEntity<ApiResponse<List<AcademicCohortResponse>>> searchCohorts(
            @RequestParam(required = false) String keyword,
            @RequestParam(required = false) Boolean isActive) {
        return ResponseEntity.ok(ApiResponse.success("Lấy danh sách niên khóa thành công",
                academicCohortService.searchCohorts(keyword, isActive)));
    }

    @GetMapping("/admin/{id}")
    @PreAuthorize("hasAnyRole('ADMIN','SUPER_ADMIN') or @rbacPermissionEvaluator.hasCurrentRequestPermission(authentication)")
    @Operation(summary = "Admin lấy chi tiết niên khóa")
    public ResponseEntity<ApiResponse<AcademicCohortResponse>> getCohort(@PathVariable UUID id) {
        return ResponseEntity.ok(ApiResponse.success("Lấy niên khóa thành công", academicCohortService.getCohort(id)));
    }

    @PostMapping("/admin")
    @PreAuthorize("hasAnyRole('ADMIN','SUPER_ADMIN') or @rbacPermissionEvaluator.hasCurrentRequestPermission(authentication)")
    @Operation(summary = "Admin tạo niên khóa")
    public ResponseEntity<ApiResponse<AcademicCohortResponse>> createCohort(@RequestBody AcademicCohortRequest request) {
        return ResponseEntity.ok(ApiResponse.success("Tạo niên khóa thành công", academicCohortService.createCohort(request)));
    }

    @PutMapping("/admin/{id}")
    @PreAuthorize("hasAnyRole('ADMIN','SUPER_ADMIN') or @rbacPermissionEvaluator.hasCurrentRequestPermission(authentication)")
    @Operation(summary = "Admin cập nhật niên khóa")
    public ResponseEntity<ApiResponse<AcademicCohortResponse>> updateCohort(@PathVariable UUID id,
                                                                            @RequestBody AcademicCohortRequest request) {
        return ResponseEntity.ok(ApiResponse.success("Cập nhật niên khóa thành công",
                academicCohortService.updateCohort(id, request)));
    }

    @DeleteMapping("/admin/{id}")
    @PreAuthorize("hasAnyRole('ADMIN','SUPER_ADMIN') or @rbacPermissionEvaluator.hasCurrentRequestPermission(authentication)")
    @Operation(summary = "Admin xóa mềm niên khóa")
    public ResponseEntity<ApiResponse<Void>> deleteCohort(@PathVariable UUID id) {
        academicCohortService.deleteCohort(id);
        return ResponseEntity.ok(ApiResponse.success("Xóa niên khóa thành công", null));
    }
}

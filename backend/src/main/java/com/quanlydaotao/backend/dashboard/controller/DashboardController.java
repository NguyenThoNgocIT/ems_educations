package com.quanlydaotao.backend.dashboard.controller;

import com.quanlydaotao.backend.common.dto.ApiResponse;
import com.quanlydaotao.backend.dashboard.dto.AdminDashboardStatsResponse;
import com.quanlydaotao.backend.dashboard.dto.AdminStudyStatsResponse;
import com.quanlydaotao.backend.dashboard.service.DashboardService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/v1/dashboard")
@RequiredArgsConstructor
@Tag(name = "Thống kê quản trị", description = "API thống kê tổng quan cho dashboard quản trị")
public class DashboardController {
    private final DashboardService dashboardService;

    @GetMapping("/admin/stats")
    @PreAuthorize("hasAnyRole('ADMIN','SUPER_ADMIN') or @rbacPermissionEvaluator.hasCurrentRequestPermission(authentication)")
    @Operation(summary = "Lấy thống kê tổng quan của admin")
    public ResponseEntity<ApiResponse<AdminDashboardStatsResponse>> getAdminStats() {
        return ResponseEntity.ok(ApiResponse.success("Lấy thống kê tổng quan thành công", dashboardService.getAdminStats()));
    }

    @GetMapping("/admin/study-stats")
    @PreAuthorize("hasAnyRole('ADMIN','SUPER_ADMIN') or @rbacPermissionEvaluator.hasCurrentRequestPermission(authentication)")
    @Operation(summary = "Lấy thống kê học tập của admin")
    public ResponseEntity<ApiResponse<AdminStudyStatsResponse>> getAdminStudyStats() {
        return ResponseEntity.ok(ApiResponse.success("Lấy thống kê học tập thành công", dashboardService.getAdminStudyStats()));
    }
}

package com.quanlydaotao.backend.scheduling.controller;

import ai.timefold.solver.core.api.solver.SolverStatus;
import com.quanlydaotao.backend.common.dto.ApiResponse;
import com.quanlydaotao.backend.scheduling.service.AutoScheduleService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.UUID;

@RestController
@RequestMapping("/api/v1/auto-schedules")
@RequiredArgsConstructor
@Tag(name = "Tự động xếp lịch", description = "API quản lý tiến trình xếp lịch học tự động bằng Timefold AI")
public class AutoScheduleController {

    private final AutoScheduleService autoScheduleService;

    @PostMapping("/generate/{semesterId}")
    @PreAuthorize("hasAnyRole('ADMIN','SUPER_ADMIN') or @rbacPermissionEvaluator.hasCurrentRequestPermission(authentication)")
    @Operation(summary = "Kích hoạt tiến trình xếp lịch tự động cho một học kỳ")
    public ResponseEntity<ApiResponse<String>> generateSchedule(@PathVariable UUID semesterId) {
        autoScheduleService.generateScheduleForSemester(semesterId);
        return ResponseEntity.ok(ApiResponse.success("Đã kích hoạt tiến trình xếp lịch tự động. Vui lòng kiểm tra trạng thái."));
    }

    @GetMapping("/status/{semesterId}")
    @PreAuthorize("hasAnyRole('ADMIN','SUPER_ADMIN') or @rbacPermissionEvaluator.hasCurrentRequestPermission(authentication)")
    @Operation(summary = "Kiểm tra trạng thái tiến trình xếp lịch tự động")
    public ResponseEntity<ApiResponse<String>> getSolverStatus(@PathVariable UUID semesterId) {
        SolverStatus status = autoScheduleService.getSolverStatus(semesterId);
        return ResponseEntity.ok(ApiResponse.success("Trạng thái hiện tại: " + status.name(), status.name()));
    }
}

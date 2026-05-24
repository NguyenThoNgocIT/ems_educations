package com.quanlydaotao.backend.scheduleadjustment.controller;

import com.quanlydaotao.backend.common.dto.ApiResponse;
import com.quanlydaotao.backend.scheduleadjustment.dto.ScheduleAdjustmentBatchApproveRequest;
import com.quanlydaotao.backend.scheduleadjustment.dto.ScheduleAdjustmentBatchApproveResponse;
import com.quanlydaotao.backend.scheduleadjustment.dto.ScheduleAdjustmentResponse;
import com.quanlydaotao.backend.scheduleadjustment.dto.ScheduleAdjustmentReviewRequest;
import com.quanlydaotao.backend.scheduleadjustment.dto.ScheduleAdjustmentStatisticsResponse;
import com.quanlydaotao.backend.scheduleadjustment.service.ScheduleAdjustmentService;
import com.quanlydaotao.backend.scheduling.service.ScheduleQueryService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/v1/admin/schedule-adjustments")
@RequiredArgsConstructor
@PreAuthorize("hasAnyRole('ADMIN','SUPER_ADMIN')")
@Tag(name = "Admin điều chỉnh lịch giảng dạy", description = "API admin duyệt và tra cứu yêu cầu điều chỉnh lịch")
public class AdminScheduleAdjustmentController {
    private final ScheduleAdjustmentService service;
    private final ScheduleQueryService scheduleQueryService;

    @GetMapping
    @Operation(summary = "Admin tra cứu toàn bộ yêu cầu điều chỉnh lịch")
    public ResponseEntity<ApiResponse<List<ScheduleAdjustmentResponse>>> searchAdmin(
            @RequestParam(required = false) String status,
            @RequestParam(required = false) UUID courseClassId,
            @RequestParam(required = false) UUID instructorId) {
        return ResponseEntity.ok(ApiResponse.success("Lấy danh sách yêu cầu điều chỉnh lịch thành công",
                service.searchAdmin(status, courseClassId, instructorId)));
    }

    @PostMapping("/{requestId}/approve")
    @Operation(summary = "Admin duyệt yêu cầu điều chỉnh lịch")
    public ResponseEntity<ApiResponse<ScheduleAdjustmentResponse>> approve(
            @PathVariable UUID requestId,
            @Valid @RequestBody ScheduleAdjustmentReviewRequest request) {
        return ResponseEntity.ok(ApiResponse.success("Duyệt yêu cầu điều chỉnh lịch thành công", service.approve(requestId, request)));
    }

    @PostMapping("/{requestId}/reject")
    @Operation(summary = "Admin từ chối yêu cầu điều chỉnh lịch")
    public ResponseEntity<ApiResponse<ScheduleAdjustmentResponse>> reject(
            @PathVariable UUID requestId,
            @Valid @RequestBody ScheduleAdjustmentReviewRequest request) {
        return ResponseEntity.ok(ApiResponse.success("Từ chối yêu cầu điều chỉnh lịch thành công", service.reject(requestId, request)));
    }

    @PostMapping("/{requestId}/return")
    @Operation(summary = "Admin trả yêu cầu điều chỉnh lịch về cho giảng viên bổ sung")
    public ResponseEntity<ApiResponse<ScheduleAdjustmentResponse>> returnToInstructor(
            @PathVariable UUID requestId,
            @Valid @RequestBody ScheduleAdjustmentReviewRequest request) {
        return ResponseEntity.ok(ApiResponse.success("Trả yêu cầu điều chỉnh lịch thành công", service.returnToInstructor(requestId, request)));
    }

    @PostMapping("/batch-approve")
    @Operation(summary = "Admin duyệt hàng loạt yêu cầu điều chỉnh lịch")
    public ResponseEntity<ApiResponse<ScheduleAdjustmentBatchApproveResponse>> batchApprove(
            @Valid @RequestBody ScheduleAdjustmentBatchApproveRequest request) {
        return ResponseEntity.ok(ApiResponse.success("Duyệt hàng loạt yêu cầu điều chỉnh lịch hoàn tất",
                service.batchApprove(request)));
    }

    @GetMapping("/statistics")
    @Operation(summary = "Admin xem thống kê tổng hợp yêu cầu điều chỉnh lịch")
    public ResponseEntity<ApiResponse<ScheduleAdjustmentStatisticsResponse>> statistics() {
        return ResponseEntity.ok(ApiResponse.success("Lấy thống kê điều chỉnh lịch thành công",
                scheduleQueryService.getScheduleAdjustmentStatistics()));
    }
}

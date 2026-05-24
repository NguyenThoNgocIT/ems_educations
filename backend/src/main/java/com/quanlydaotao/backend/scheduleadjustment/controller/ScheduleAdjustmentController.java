package com.quanlydaotao.backend.scheduleadjustment.controller;

import com.quanlydaotao.backend.common.dto.ApiResponse;
import com.quanlydaotao.backend.scheduleadjustment.dto.ScheduleAdjustmentResponse;
import com.quanlydaotao.backend.scheduleadjustment.dto.ScheduleAdjustmentReviewRequest;
import com.quanlydaotao.backend.scheduleadjustment.dto.ScheduleAdjustmentSubmitRequest;
import com.quanlydaotao.backend.scheduleadjustment.dto.ScheduleAdjustmentValidateRequest;
import com.quanlydaotao.backend.scheduleadjustment.dto.ScheduleAdjustmentValidationResponse;
import com.quanlydaotao.backend.scheduleadjustment.service.ScheduleAdjustmentService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
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
@RequestMapping("/api/v1/schedule-adjustments")
@RequiredArgsConstructor
@Tag(name = "Điều chỉnh lịch giảng dạy", description = "API xử lý nghỉ, bù, tăng tiết và đổi lịch qua request/override")
public class ScheduleAdjustmentController {
    private final ScheduleAdjustmentService service;

    @PostMapping("/validate")
    @PreAuthorize("hasRole('LECTURER')")
    @Operation(summary = "Kiểm tra tự động yêu cầu điều chỉnh lịch")
    public ResponseEntity<ApiResponse<ScheduleAdjustmentValidationResponse>> validate(
            Authentication authentication,
            @Valid @RequestBody ScheduleAdjustmentValidateRequest request) {
        return ResponseEntity.ok(ApiResponse.success("Kiểm tra yêu cầu điều chỉnh lịch thành công",
                service.validateForCurrentInstructor(authentication.getName(), request)));
    }

    @PostMapping
    @PreAuthorize("hasRole('LECTURER')")
    @Operation(summary = "Giảng viên gửi yêu cầu nghỉ, bù, tăng tiết hoặc đổi lịch")
    public ResponseEntity<ApiResponse<ScheduleAdjustmentResponse>> submit(
            Authentication authentication,
            @Valid @RequestBody ScheduleAdjustmentSubmitRequest request) {
        return ResponseEntity.ok(ApiResponse.success("Gửi yêu cầu điều chỉnh lịch thành công",
                service.submitForCurrentInstructor(authentication.getName(), request)));
    }

    @GetMapping("/me")
    @PreAuthorize("hasRole('LECTURER')")
    @Operation(summary = "Giảng viên xem danh sách yêu cầu điều chỉnh lịch của mình")
    public ResponseEntity<ApiResponse<List<ScheduleAdjustmentResponse>>> getMine(Authentication authentication) {
        return ResponseEntity.ok(ApiResponse.success("Lấy danh sách yêu cầu điều chỉnh lịch thành công",
                service.getCurrentInstructorRequests(authentication.getName())));
    }

    @GetMapping("/admin/instructor/{instructorId}")
    @PreAuthorize("hasAnyRole('ADMIN','SUPER_ADMIN')")
    @Operation(summary = "Admin xem yêu cầu điều chỉnh lịch của một giảng viên")
    public ResponseEntity<ApiResponse<List<ScheduleAdjustmentResponse>>> getByInstructor(@PathVariable UUID instructorId) {
        return ResponseEntity.ok(ApiResponse.success("Lấy danh sách yêu cầu điều chỉnh lịch thành công",
                service.getByInstructor(instructorId)));
    }

    @GetMapping("/admin")
    @PreAuthorize("hasAnyRole('ADMIN','SUPER_ADMIN')")
    @Operation(summary = "Admin tra cứu toàn bộ yêu cầu điều chỉnh lịch")
    public ResponseEntity<ApiResponse<List<ScheduleAdjustmentResponse>>> searchAdmin(
            @RequestParam(required = false) String status,
            @RequestParam(required = false) UUID courseClassId,
            @RequestParam(required = false) UUID instructorId) {
        return ResponseEntity.ok(ApiResponse.success("Lấy danh sách yêu cầu điều chỉnh lịch thành công",
                service.searchAdmin(status, courseClassId, instructorId)));
    }

    @PostMapping("/admin/{requestId}/approve")
    @PreAuthorize("hasAnyRole('ADMIN','SUPER_ADMIN')")
    @Operation(summary = "Admin duyệt yêu cầu điều chỉnh lịch")
    public ResponseEntity<ApiResponse<ScheduleAdjustmentResponse>> approve(
            @PathVariable UUID requestId,
            @Valid @RequestBody ScheduleAdjustmentReviewRequest request) {
        return ResponseEntity.ok(ApiResponse.success("Duyệt yêu cầu điều chỉnh lịch thành công", service.approve(requestId, request)));
    }

    @PostMapping("/admin/{requestId}/reject")
    @PreAuthorize("hasAnyRole('ADMIN','SUPER_ADMIN')")
    @Operation(summary = "Admin từ chối yêu cầu điều chỉnh lịch")
    public ResponseEntity<ApiResponse<ScheduleAdjustmentResponse>> reject(
            @PathVariable UUID requestId,
            @Valid @RequestBody ScheduleAdjustmentReviewRequest request) {
        return ResponseEntity.ok(ApiResponse.success("Từ chối yêu cầu điều chỉnh lịch thành công", service.reject(requestId, request)));
    }

    @PostMapping("/admin/{requestId}/return")
    @PreAuthorize("hasAnyRole('ADMIN','SUPER_ADMIN')")
    @Operation(summary = "Admin trả yêu cầu điều chỉnh lịch về cho giảng viên bổ sung")
    public ResponseEntity<ApiResponse<ScheduleAdjustmentResponse>> returnToInstructor(
            @PathVariable UUID requestId,
            @Valid @RequestBody ScheduleAdjustmentReviewRequest request) {
        return ResponseEntity.ok(ApiResponse.success("Trả yêu cầu điều chỉnh lịch thành công", service.returnToInstructor(requestId, request)));
    }
}

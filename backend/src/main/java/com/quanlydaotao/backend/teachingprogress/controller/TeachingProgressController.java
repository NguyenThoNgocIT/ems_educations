package com.quanlydaotao.backend.teachingprogress.controller;

import com.quanlydaotao.backend.common.dto.ApiResponse;
import com.quanlydaotao.backend.teachingprogress.dto.TeachingProgressLogRequest;
import com.quanlydaotao.backend.teachingprogress.dto.TeachingProgressLogResponse;
import com.quanlydaotao.backend.teachingprogress.dto.TeachingProgressSummaryResponse;
import com.quanlydaotao.backend.teachingprogress.service.TeachingProgressService;
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
@RequestMapping("/api/v1/teaching-progress")
@RequiredArgsConstructor
@Tag(name = "Quản lý tiến độ giảng dạy", description = "API theo dõi buổi dạy thực tế so với kế hoạch")
public class TeachingProgressController {
    private final TeachingProgressService service;

    @PostMapping("/admin")
    @PreAuthorize("hasAnyRole('ADMIN','SUPER_ADMIN') or @rbacPermissionEvaluator.hasCurrentRequestPermission(authentication)")
    @Operation(summary = "Admin ghi nhận buổi dạy thực tế")
    public ResponseEntity<ApiResponse<TeachingProgressLogResponse>> log(@Valid @RequestBody TeachingProgressLogRequest request) {
        return ResponseEntity.ok(ApiResponse.success("Ghi nhận buổi dạy thành công", service.logSession(request)));
    }

    @GetMapping("/admin/course-classes/{courseClassId}/logs")
    @PreAuthorize("hasAnyRole('ADMIN','SUPER_ADMIN') or @rbacPermissionEvaluator.hasCurrentRequestPermission(authentication)")
    @Operation(summary = "Admin xem các buổi dạy thực tế của lớp học phần")
    public ResponseEntity<ApiResponse<List<TeachingProgressLogResponse>>> logs(@PathVariable UUID courseClassId) {
        return ResponseEntity.ok(ApiResponse.success("Lấy buổi dạy thực tế thành công", service.getLogs(courseClassId)));
    }

    @GetMapping("/admin/course-classes/{courseClassId}/summary")
    @PreAuthorize("hasAnyRole('ADMIN','SUPER_ADMIN') or @rbacPermissionEvaluator.hasCurrentRequestPermission(authentication)")
    @Operation(summary = "Admin xem tổng hợp tiến độ giảng dạy của lớp học phần")
    public ResponseEntity<ApiResponse<TeachingProgressSummaryResponse>> summary(@PathVariable UUID courseClassId) {
        return ResponseEntity.ok(ApiResponse.success("Lấy tiến độ giảng dạy thành công", service.getSummary(courseClassId)));
    }
}

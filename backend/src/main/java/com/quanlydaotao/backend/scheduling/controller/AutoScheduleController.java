package com.quanlydaotao.backend.scheduling.controller;

import ai.timefold.solver.core.api.solver.SolverStatus;
import com.quanlydaotao.backend.common.dto.ApiResponse;
import com.quanlydaotao.backend.scheduling.service.AutoScheduleService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.util.UUID;

@RestController
@RequestMapping("/api/v1/auto-schedules")
@RequiredArgsConstructor
@Tag(name = "Tự động xếp lịch", description = "API tự động xếp lịch gốc theo lớp học phần, giảng viên, phòng học và ca học")
public class AutoScheduleController {

    private final AutoScheduleService autoScheduleService;

    @PostMapping("/generate/{semesterId}")
    @PreAuthorize("hasAnyRole('ADMIN','SUPER_ADMIN') or @rbacPermissionEvaluator.hasCurrentRequestPermission(authentication)")
    @Operation(summary = "Tự động xếp lịch gốc cho các lớp học phần còn thiếu tiết trong một học kỳ")
    public ResponseEntity<ApiResponse<String>> generateSchedule(@PathVariable UUID semesterId) {
        autoScheduleService.generateScheduleForSemester(semesterId);
        return ResponseEntity.ok(ApiResponse.success("Đã hoàn tất tự động xếp lịch gốc", "COMPLETED"));
    }

    @PostMapping("/course-classes/{courseClassId}/generate")
    @PreAuthorize("hasAnyRole('ADMIN','SUPER_ADMIN') or @rbacPermissionEvaluator.hasCurrentRequestPermission(authentication)")
    @Operation(summary = "Tự động xếp lịch gốc cho một lớp học phần đã có giảng viên và sinh viên")
    public ResponseEntity<ApiResponse<Integer>> generateCourseClassSchedule(
            @PathVariable UUID courseClassId,
            @RequestParam(required = false) UUID instructorId) {
        int created = autoScheduleService.generateScheduleForCourseClass(courseClassId, instructorId);
        return ResponseEntity.ok(ApiResponse.success("Đã tạo lịch gốc cho lớp học phần", created));
    }

    @GetMapping("/status/{semesterId}")
    @PreAuthorize("hasAnyRole('ADMIN','SUPER_ADMIN') or @rbacPermissionEvaluator.hasCurrentRequestPermission(authentication)")
    @Operation(summary = "Kiểm tra trạng thái tiến trình xếp lịch tự động")
    public ResponseEntity<ApiResponse<String>> getSolverStatus(@PathVariable UUID semesterId) {
        SolverStatus status = autoScheduleService.getSolverStatus(semesterId);
        return ResponseEntity.ok(ApiResponse.success("Trạng thái hiện tại: " + status.name(), status.name()));
    }
}

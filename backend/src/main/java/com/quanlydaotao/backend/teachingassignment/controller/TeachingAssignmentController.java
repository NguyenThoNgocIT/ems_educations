package com.quanlydaotao.backend.teachingassignment.controller;

import com.quanlydaotao.backend.common.dto.ApiResponse;
import com.quanlydaotao.backend.teachingassignment.dto.TeachingAssignmentRequest;
import com.quanlydaotao.backend.teachingassignment.dto.TeachingAssignmentResponse;
import com.quanlydaotao.backend.teachingassignment.service.TeachingAssignmentService;
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
@RequestMapping("/api/v1/teaching-assignments")
@RequiredArgsConstructor
@Tag(name = "Quản lý phân công giảng dạy", description = "API admin phân công giảng viên cho lớp học phần")
public class TeachingAssignmentController {
    private final TeachingAssignmentService service;

    @GetMapping("/admin")
    @PreAuthorize("hasAnyRole('ADMIN','SUPER_ADMIN')")
    @Operation(summary = "Admin lấy danh sách phân công giảng dạy")
    public ResponseEntity<ApiResponse<List<TeachingAssignmentResponse>>> search(
            @RequestParam(required = false) UUID instructorId,
            @RequestParam(required = false) UUID courseClassId,
            @RequestParam(required = false) UUID classId,
            @RequestParam(required = false) UUID semesterId,
            @RequestParam(required = false) Boolean isActive) {
        return ResponseEntity.ok(ApiResponse.success("Lấy phân công giảng dạy thành công",
                service.search(instructorId, courseClassId, classId, semesterId, isActive)));
    }

    @PostMapping("/admin")
    @PreAuthorize("hasAnyRole('ADMIN','SUPER_ADMIN')")
    @Operation(summary = "Admin phân công giảng viên cho lớp học phần")
    public ResponseEntity<ApiResponse<TeachingAssignmentResponse>> assign(@Valid @RequestBody TeachingAssignmentRequest request) {
        return ResponseEntity.ok(ApiResponse.success("Phân công giảng dạy thành công", service.assign(request)));
    }
}

package com.quanlydaotao.backend.trainingprogramcourse.controller;

import com.quanlydaotao.backend.common.dto.ApiResponse;
import com.quanlydaotao.backend.trainingprogramcourse.dto.TrainingProgramCourseRequest;
import com.quanlydaotao.backend.trainingprogramcourse.dto.TrainingProgramCourseResponse;
import com.quanlydaotao.backend.trainingprogramcourse.service.TrainingProgramCourseService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/v1/training-program-courses")
@RequiredArgsConstructor
@Tag(name = "Quản lý học phần chương trình đào tạo", description = "API lọc và gán học phần theo chương trình đào tạo")
public class TrainingProgramCourseController {
    private final TrainingProgramCourseService service;

    @GetMapping("/admin")
    @PreAuthorize("hasAnyRole('ADMIN','SUPER_ADMIN') or @rbacPermissionEvaluator.hasCurrentRequestPermission(authentication)")
    @Operation(summary = "Admin lọc học phần trong chương trình đào tạo")
    public ResponseEntity<ApiResponse<List<TrainingProgramCourseResponse>>> search(
            @RequestParam(required = false) UUID trainingProgramId,
            @RequestParam(required = false) UUID semesterId,
            @RequestParam(required = false) String coursePhase,
            @RequestParam(required = false) Boolean isRequired,
            @RequestParam(required = false) Boolean isActive) {
        return ResponseEntity.ok(ApiResponse.success(
                "Lấy học phần chương trình đào tạo thành công",
                service.search(trainingProgramId, semesterId, coursePhase, isRequired, isActive)));
    }

    @PostMapping("/admin")
    @PreAuthorize("hasAnyRole('ADMIN','SUPER_ADMIN') or @rbacPermissionEvaluator.hasCurrentRequestPermission(authentication)")
    @Operation(summary = "Admin thêm môn học vào chương trình đào tạo")
    public ResponseEntity<ApiResponse<TrainingProgramCourseResponse>> create(
            @Valid @RequestBody TrainingProgramCourseRequest request) {
        return ResponseEntity.ok(ApiResponse.success(
                "Thêm môn học vào chương trình đào tạo thành công",
                service.create(request)));
    }

    @PutMapping("/admin/{trainingProgramId}/{courseId}")
    @PreAuthorize("hasAnyRole('ADMIN','SUPER_ADMIN') or @rbacPermissionEvaluator.hasCurrentRequestPermission(authentication)")
    @Operation(summary = "Admin cập nhật môn học trong chương trình đào tạo")
    public ResponseEntity<ApiResponse<TrainingProgramCourseResponse>> update(
            @PathVariable UUID trainingProgramId,
            @PathVariable UUID courseId,
            @Valid @RequestBody TrainingProgramCourseRequest request) {
        return ResponseEntity.ok(ApiResponse.success(
                "Cập nhật môn học trong chương trình đào tạo thành công",
                service.update(trainingProgramId, courseId, request)));
    }

    @DeleteMapping("/admin/{trainingProgramId}/{courseId}")
    @PreAuthorize("hasAnyRole('ADMIN','SUPER_ADMIN') or @rbacPermissionEvaluator.hasCurrentRequestPermission(authentication)")
    @Operation(summary = "Admin xóa môn học khỏi chương trình đào tạo")
    public ResponseEntity<ApiResponse<Void>> delete(
            @PathVariable UUID trainingProgramId,
            @PathVariable UUID courseId) {
        service.delete(trainingProgramId, courseId);
        return ResponseEntity.ok(ApiResponse.success(
                "Xóa môn học khỏi chương trình đào tạo thành công",
                null));
    }

    @GetMapping("/admin/by-student/{studentId}")
    @PreAuthorize("hasAnyRole('ADMIN','SUPER_ADMIN') or @rbacPermissionEvaluator.hasCurrentRequestPermission(authentication)")
    @Operation(summary = "Admin lấy học phần theo chương trình hiện tại của sinh viên")
    public ResponseEntity<ApiResponse<List<TrainingProgramCourseResponse>>> getForStudent(
            @PathVariable UUID studentId,
            @RequestParam(required = false) UUID semesterId) {
        return ResponseEntity.ok(ApiResponse.success(
                "Lấy học phần của sinh viên thành công",
                service.getCoursesForStudent(studentId, semesterId)));
    }
}

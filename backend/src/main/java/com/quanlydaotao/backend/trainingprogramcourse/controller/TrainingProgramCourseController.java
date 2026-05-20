package com.quanlydaotao.backend.trainingprogramcourse.controller;

import com.quanlydaotao.backend.common.dto.ApiResponse;
import com.quanlydaotao.backend.trainingprogramcourse.dto.TrainingProgramCourseResponse;
import com.quanlydaotao.backend.trainingprogramcourse.service.TrainingProgramCourseService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/v1/training-program-courses")
@RequiredArgsConstructor
@Tag(name = "Quản lý học phần chương trình đào tạo", description = "API lọc học phần theo chương trình đào tạo và sinh viên")
public class TrainingProgramCourseController {
    private final TrainingProgramCourseService service;

    @GetMapping("/admin")
    @PreAuthorize("hasAnyRole('ADMIN','SUPER_ADMIN')")
    @Operation(summary = "Admin lọc học phần trong chương trình đào tạo")
    public ResponseEntity<ApiResponse<List<TrainingProgramCourseResponse>>> search(
            @RequestParam(required = false) UUID trainingProgramId,
            @RequestParam(required = false) UUID semesterId,
            @RequestParam(required = false) String coursePhase,
            @RequestParam(required = false) Boolean isRequired,
            @RequestParam(required = false) Boolean isActive) {
        return ResponseEntity.ok(ApiResponse.success("Lấy học phần chương trình đào tạo thành công",
                service.search(trainingProgramId, semesterId, coursePhase, isRequired, isActive)));
    }

    @GetMapping("/admin/by-student/{studentId}")
    @PreAuthorize("hasAnyRole('ADMIN','SUPER_ADMIN')")
    @Operation(summary = "Admin lấy học phần theo chương trình hiện tại của sinh viên")
    public ResponseEntity<ApiResponse<List<TrainingProgramCourseResponse>>> getForStudent(
            @PathVariable UUID studentId,
            @RequestParam(required = false) UUID semesterId) {
        return ResponseEntity.ok(ApiResponse.success("Lấy học phần của sinh viên thành công",
                service.getCoursesForStudent(studentId, semesterId)));
    }
}

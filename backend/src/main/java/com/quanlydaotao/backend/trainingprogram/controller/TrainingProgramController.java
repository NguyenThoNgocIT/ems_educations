package com.quanlydaotao.backend.trainingprogram.controller;

import com.quanlydaotao.backend.common.dto.ApiResponse;
import com.quanlydaotao.backend.trainingprogram.dto.TrainingProgramRequest;
import com.quanlydaotao.backend.trainingprogram.dto.TrainingProgramResponse;
import com.quanlydaotao.backend.trainingprogram.service.TrainingProgramService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/v1/training-programs")
@RequiredArgsConstructor
@Tag(name = "Quản lý chương trình đào tạo", description = "API admin quản lý chương trình đào tạo theo ngành và niên khóa")
public class TrainingProgramController {
    private final TrainingProgramService trainingProgramService;

    @GetMapping("/admin")
    @PreAuthorize("hasAnyRole('ADMIN','SUPER_ADMIN')")
    @Operation(summary = "Admin lấy danh sách chương trình đào tạo")
    public ResponseEntity<ApiResponse<List<TrainingProgramResponse>>> getAllPrograms(
            @RequestParam(required = false) String keyword,
            @RequestParam(required = false) UUID majorId,
            @RequestParam(required = false) UUID departmentId,
            @RequestParam(required = false) UUID academicCohortId,
            @RequestParam(required = false) Boolean isActive) {
        return ResponseEntity.ok(ApiResponse.success("Lấy danh sách chương trình đào tạo thành công",
                trainingProgramService.getAllPrograms(keyword, majorId, departmentId, academicCohortId, isActive)));
    }

    @GetMapping("/admin/{id}")
    @PreAuthorize("hasAnyRole('ADMIN','SUPER_ADMIN')")
    @Operation(summary = "Admin lấy chi tiết chương trình đào tạo")
    public ResponseEntity<ApiResponse<TrainingProgramResponse>> getProgramById(@PathVariable UUID id) {
        return ResponseEntity.ok(ApiResponse.success("Lấy chương trình đào tạo thành công",
                trainingProgramService.getProgramById(id)));
    }

    @PostMapping("/admin")
    @PreAuthorize("hasAnyRole('ADMIN','SUPER_ADMIN')")
    @Operation(summary = "Admin tạo chương trình đào tạo")
    public ResponseEntity<ApiResponse<TrainingProgramResponse>> createProgram(@RequestBody TrainingProgramRequest request) {
        return ResponseEntity.ok(ApiResponse.success("Tạo chương trình đào tạo thành công",
                trainingProgramService.createProgram(request)));
    }

    @PutMapping("/admin/{id}")
    @PreAuthorize("hasAnyRole('ADMIN','SUPER_ADMIN')")
    @Operation(summary = "Admin cập nhật chương trình đào tạo")
    public ResponseEntity<ApiResponse<TrainingProgramResponse>> updateProgram(@PathVariable UUID id,
                                                                         @RequestBody TrainingProgramRequest request) {
        return ResponseEntity.ok(ApiResponse.success("Cập nhật chương trình đào tạo thành công",
                trainingProgramService.updateProgram(id, request)));
    }

    @DeleteMapping("/admin/{id}")
    @PreAuthorize("hasAnyRole('ADMIN','SUPER_ADMIN')")
    @Operation(summary = "Admin xóa mềm chương trình đào tạo")
    public ResponseEntity<ApiResponse<Void>> deleteProgram(@PathVariable UUID id) {
        trainingProgramService.deleteProgram(id);
        return ResponseEntity.ok(ApiResponse.success("Xóa chương trình đào tạo thành công", null));
    }
}

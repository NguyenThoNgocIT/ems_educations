package com.quanlydaotao.backend.trainingprogram.controller;

import com.quanlydaotao.backend.common.dto.ApiResponse;
import com.quanlydaotao.backend.trainingprogram.dto.request.CreateTrainingProgramRequest;
import com.quanlydaotao.backend.trainingprogram.dto.request.TrainingProgramSearchRequest;
import com.quanlydaotao.backend.trainingprogram.dto.request.UpdateTrainingProgramRequest;
import com.quanlydaotao.backend.trainingprogram.dto.response.TrainingProgramDetailResponse;
import com.quanlydaotao.backend.trainingprogram.dto.response.TrainingProgramResponse;
import com.quanlydaotao.backend.trainingprogram.service.TrainingProgramService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.data.web.PageableDefault;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.UUID;

@RestController
@RequestMapping("/api/v1/training-programs")
@RequiredArgsConstructor
@Tag(name = "Training Program Management", description = "APIs for managing training programs")
public class TrainingProgramController {

    private final TrainingProgramService trainingProgramService;

    @PostMapping
    @Operation(summary = "Create new training program")
    public ResponseEntity<ApiResponse<TrainingProgramResponse>> createTrainingProgram(@Valid @RequestBody CreateTrainingProgramRequest request) {
        TrainingProgramResponse response = trainingProgramService.createTrainingProgram(request);
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.success("Tạo chương trình đào tạo thành công", response));
    }

    @GetMapping("/{id}")
    @Operation(summary = "Get training program by ID")
    public ResponseEntity<ApiResponse<TrainingProgramDetailResponse>> getTrainingProgramById(@PathVariable UUID id) {
        TrainingProgramDetailResponse response = trainingProgramService.getTrainingProgramById(id);
        return ResponseEntity.ok(ApiResponse.success(response));
    }

    @GetMapping
    @Operation(summary = "Search training programs with pagination")
    public ResponseEntity<ApiResponse<Page<TrainingProgramResponse>>> searchTrainingPrograms(
            @ModelAttribute TrainingProgramSearchRequest request,
            @PageableDefault(size = 10, sort = "code", direction = Sort.Direction.ASC) Pageable pageable) {
        Page<TrainingProgramResponse> response = trainingProgramService.searchTrainingPrograms(request, pageable);
        return ResponseEntity.ok(ApiResponse.success(response));
    }

    @PutMapping("/{id}")
    @Operation(summary = "Update training program")
    public ResponseEntity<ApiResponse<TrainingProgramResponse>> updateTrainingProgram(
            @PathVariable UUID id,
            @Valid @RequestBody UpdateTrainingProgramRequest request) {
        TrainingProgramResponse response = trainingProgramService.updateTrainingProgram(id, request);
        return ResponseEntity.ok(ApiResponse.success("Cập nhật chương trình đào tạo thành công", response));
    }

    @DeleteMapping("/{id}")
    @Operation(summary = "Delete training program (soft delete)")
    public ResponseEntity<ApiResponse<Void>> deleteTrainingProgram(@PathVariable UUID id) {
        trainingProgramService.deleteTrainingProgram(id);
        return ResponseEntity.ok(ApiResponse.success("Xóa chương trình đào tạo thành công", null));
    }
}
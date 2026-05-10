package com.quanlydaotao.backend.semester.controller;

import com.quanlydaotao.backend.common.dto.ApiResponse;
import com.quanlydaotao.backend.semester.dto.request.CreateSemesterRequest;
import com.quanlydaotao.backend.semester.dto.request.SemesterSearchRequest;
import com.quanlydaotao.backend.semester.dto.request.UpdateSemesterRequest;
import com.quanlydaotao.backend.semester.dto.response.SemesterDetailResponse;
import com.quanlydaotao.backend.semester.dto.response.SemesterResponse;
import com.quanlydaotao.backend.semester.service.SemesterService;
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

@RestController
@RequestMapping("/api/v1/semesters")
@RequiredArgsConstructor
@Tag(name = "Semester Management", description = "APIs for managing semesters")
public class SemesterController {
    
    private final SemesterService semesterService;
    
    @PostMapping
    @Operation(summary = "Create new semester")
    public ResponseEntity<ApiResponse<SemesterResponse>> createSemester(@Valid @RequestBody CreateSemesterRequest request) {
        SemesterResponse response = semesterService.createSemester(request);
        return ResponseEntity.status(HttpStatus.CREATED)
            .body(ApiResponse.success("Tạo học kỳ thành công", response));
    }
    
    @GetMapping("/{id}")
    @Operation(summary = "Get semester by ID")
    public ResponseEntity<ApiResponse<SemesterDetailResponse>> getSemesterById(@PathVariable String id) {
        SemesterDetailResponse response = semesterService.getSemesterById(id);
        return ResponseEntity.ok(ApiResponse.success(response));
    }
    
    @GetMapping
    @Operation(summary = "Search semesters with pagination")
    public ResponseEntity<ApiResponse<Page<SemesterResponse>>> searchSemesters(
            @ModelAttribute SemesterSearchRequest request,
            @PageableDefault(size = 10, sort = "startDate", direction = Sort.Direction.DESC) Pageable pageable) {
        Page<SemesterResponse> response = semesterService.searchSemesters(request, pageable);
        return ResponseEntity.ok(ApiResponse.success(response));
    }
    
    @PutMapping("/{id}")
    @Operation(summary = "Update semester")
    public ResponseEntity<ApiResponse<SemesterResponse>> updateSemester(
            @PathVariable String id,
            @Valid @RequestBody UpdateSemesterRequest request) {
        SemesterResponse response = semesterService.updateSemester(id, request);
        return ResponseEntity.ok(ApiResponse.success("Cập nhật học kỳ thành công", response));
    }
    
    @DeleteMapping("/{id}")
    @Operation(summary = "Delete semester (soft delete)")
    public ResponseEntity<ApiResponse<Void>> deleteSemester(@PathVariable String id) {
        semesterService.deleteSemester(id);
        return ResponseEntity.ok(ApiResponse.success("Xóa học kỳ thành công", null));
    }
    
    @PostMapping("/{id}/activate")
    @Operation(summary = "Activate a semester")
    public ResponseEntity<ApiResponse<SemesterResponse>> activateSemester(@PathVariable String id) {
        SemesterResponse response = semesterService.activateSemester(id);
        return ResponseEntity.ok(ApiResponse.success("Kích hoạt học kỳ thành công", response));
    }
    
    @GetMapping("/current")
    @Operation(summary = "Get current semester")
    public ResponseEntity<ApiResponse<SemesterDetailResponse>> getCurrentSemester() {
        SemesterDetailResponse response = semesterService.getCurrentSemester();
        return ResponseEntity.ok(ApiResponse.success(response));
    }
}
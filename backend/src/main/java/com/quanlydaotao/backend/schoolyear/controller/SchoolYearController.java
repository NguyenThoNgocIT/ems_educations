package com.quanlydaotao.backend.schoolyear.controller;

import com.quanlydaotao.backend.common.dto.ApiResponse;
import com.quanlydaotao.backend.schoolyear.dto.request.CreateSchoolYearRequest;
import com.quanlydaotao.backend.schoolyear.dto.request.SchoolYearSearchRequest;
import com.quanlydaotao.backend.schoolyear.dto.request.UpdateSchoolYearRequest;
import com.quanlydaotao.backend.schoolyear.dto.response.SchoolYearDetailResponse;
import com.quanlydaotao.backend.schoolyear.dto.response.SchoolYearResponse;
import com.quanlydaotao.backend.schoolyear.service.SchoolYearService;
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
@RequestMapping("/api/v1/school-years")
@RequiredArgsConstructor
@Tag(name = "School Year Management", description = "APIs for managing school years")
public class SchoolYearController {
    
    private final SchoolYearService schoolYearService;
    
    @PostMapping
    @Operation(summary = "Create new school year")
    public ResponseEntity<ApiResponse<SchoolYearResponse>> createSchoolYear(@Valid @RequestBody CreateSchoolYearRequest request) {
        SchoolYearResponse response = schoolYearService.createSchoolYear(request);
        return ResponseEntity.status(HttpStatus.CREATED)
            .body(ApiResponse.success("Tạo năm học thành công", response));
    }
    
    @GetMapping("/{id}")
    @Operation(summary = "Get school year by ID")
    public ResponseEntity<ApiResponse<SchoolYearDetailResponse>> getSchoolYearById(@PathVariable String id) {
        SchoolYearDetailResponse response = schoolYearService.getSchoolYearById(id);
        return ResponseEntity.ok(ApiResponse.success(response));
    }
    
    @GetMapping
    @Operation(summary = "Search school years with pagination")
    public ResponseEntity<ApiResponse<Page<SchoolYearResponse>>> searchSchoolYears(
            @ModelAttribute SchoolYearSearchRequest request,
            @PageableDefault(size = 10, sort = "startDate", direction = Sort.Direction.DESC) Pageable pageable) {
        Page<SchoolYearResponse> response = schoolYearService.searchSchoolYears(request, pageable);
        return ResponseEntity.ok(ApiResponse.success(response));
    }
    
    @PutMapping("/{id}")
    @Operation(summary = "Update school year")
    public ResponseEntity<ApiResponse<SchoolYearResponse>> updateSchoolYear(
            @PathVariable String id,
            @Valid @RequestBody UpdateSchoolYearRequest request) {
        SchoolYearResponse response = schoolYearService.updateSchoolYear(id, request);
        return ResponseEntity.ok(ApiResponse.success("Cập nhật năm học thành công", response));
    }
    
    @DeleteMapping("/{id}")
    @Operation(summary = "Delete school year (soft delete)")
    public ResponseEntity<ApiResponse<Void>> deleteSchoolYear(@PathVariable String id) {
        schoolYearService.deleteSchoolYear(id);
        return ResponseEntity.ok(ApiResponse.success("Xóa năm học thành công", null));
    }
    
    @GetMapping("/current")
    @Operation(summary = "Get current school year")
    public ResponseEntity<ApiResponse<SchoolYearDetailResponse>> getCurrentSchoolYear() {
        SchoolYearDetailResponse response = schoolYearService.getCurrentSchoolYear();
        return ResponseEntity.ok(ApiResponse.success(response));
    }
    
    @PostMapping("/{id}/set-current")
    @Operation(summary = "Set current school year")
    public ResponseEntity<ApiResponse<SchoolYearResponse>> setCurrentSchoolYear(@PathVariable String id) {
        SchoolYearResponse response = schoolYearService.setCurrentSchoolYear(id);
        return ResponseEntity.ok(ApiResponse.success("Đặt năm học hiện tại thành công", response));
    }
}
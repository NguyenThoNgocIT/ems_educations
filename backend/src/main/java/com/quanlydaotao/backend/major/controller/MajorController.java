package com.quanlydaotao.backend.major.controller;

import com.quanlydaotao.backend.common.dto.ApiResponse;
import com.quanlydaotao.backend.major.dto.request.CreateMajorRequest;
import com.quanlydaotao.backend.major.dto.request.MajorSearchRequest;
import com.quanlydaotao.backend.major.dto.request.UpdateMajorRequest;
import com.quanlydaotao.backend.major.dto.response.MajorDetailResponse;
import com.quanlydaotao.backend.major.dto.response.MajorResponse;
import com.quanlydaotao.backend.major.service.MajorService;
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
@RequestMapping("/api/v1/majors")
@RequiredArgsConstructor
@Tag(name = "Major Management", description = "APIs for managing majors")
public class MajorController {

    private final MajorService majorService;

    @PostMapping
    @Operation(summary = "Create new major")
    public ResponseEntity<ApiResponse<MajorResponse>> createMajor(@Valid @RequestBody CreateMajorRequest request) {
        MajorResponse response = majorService.createMajor(request);
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.success("Tạo chuyên ngành thành công", response));
    }

    @GetMapping("/{id}")
    @Operation(summary = "Get major by ID")
    public ResponseEntity<ApiResponse<MajorDetailResponse>> getMajorById(@PathVariable UUID id) {
        MajorDetailResponse response = majorService.getMajorById(id);
        return ResponseEntity.ok(ApiResponse.success(response));
    }

    @GetMapping
    @Operation(summary = "Search majors with pagination")
    public ResponseEntity<ApiResponse<Page<MajorResponse>>> searchMajors(
            @ModelAttribute MajorSearchRequest request,
            @PageableDefault(size = 10, sort = "code", direction = Sort.Direction.ASC) Pageable pageable) {
        Page<MajorResponse> response = majorService.searchMajors(request, pageable);
        return ResponseEntity.ok(ApiResponse.success(response));
    }

    @PutMapping("/{id}")
    @Operation(summary = "Update major")
    public ResponseEntity<ApiResponse<MajorResponse>> updateMajor(
            @PathVariable UUID id,
            @Valid @RequestBody UpdateMajorRequest request) {
        MajorResponse response = majorService.updateMajor(id, request);
        return ResponseEntity.ok(ApiResponse.success("Cập nhật chuyên ngành thành công", response));
    }

    @DeleteMapping("/{id}")
    @Operation(summary = "Delete major (soft delete)")
    public ResponseEntity<ApiResponse<Void>> deleteMajor(@PathVariable UUID id) {
        majorService.deleteMajor(id);
        return ResponseEntity.ok(ApiResponse.success("Xóa chuyên ngành thành công", null));
    }
}
package com.quanlydaotao.backend.classmanagement.controller;

import com.quanlydaotao.backend.common.dto.ApiResponse;
import com.quanlydaotao.backend.classmanagement.dto.request.CreateClassRequest;
import com.quanlydaotao.backend.classmanagement.dto.request.ClassSearchRequest;
import com.quanlydaotao.backend.classmanagement.dto.request.UpdateClassRequest;
import com.quanlydaotao.backend.classmanagement.dto.response.ClassDetailResponse;
import com.quanlydaotao.backend.classmanagement.dto.response.ClassResponse;
import com.quanlydaotao.backend.classmanagement.service.ClassService;
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
@RequestMapping("/api/v1/classes")
@RequiredArgsConstructor
@Tag(name = "Class Management", description = "APIs for managing classes")
public class ClassController {

    private final ClassService classService;

    @PostMapping
    @Operation(summary = "Create new class")
    public ResponseEntity<ApiResponse<ClassResponse>> createClass(@Valid @RequestBody CreateClassRequest request) {
        ClassResponse response = classService.createClass(request);
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.success("Tạo lớp thành công", response));
    }

    @GetMapping("/{id}")
    @Operation(summary = "Get class by ID")
    public ResponseEntity<ApiResponse<ClassDetailResponse>> getClassById(@PathVariable UUID id) {
        ClassDetailResponse response = classService.getClassById(id);
        return ResponseEntity.ok(ApiResponse.success(response));
    }

    @GetMapping
    @Operation(summary = "Search classes with pagination")
    public ResponseEntity<ApiResponse<Page<ClassResponse>>> searchClasses(
            @ModelAttribute ClassSearchRequest request,
            @PageableDefault(size = 10, sort = "classCode", direction = Sort.Direction.ASC) Pageable pageable) {
        Page<ClassResponse> response = classService.searchClasses(request, pageable);
        return ResponseEntity.ok(ApiResponse.success(response));
    }

    @PutMapping("/{id}")
    @Operation(summary = "Update class")
    public ResponseEntity<ApiResponse<ClassResponse>> updateClass(
            @PathVariable UUID id,
            @Valid @RequestBody UpdateClassRequest request) {
        ClassResponse response = classService.updateClass(id, request);
        return ResponseEntity.ok(ApiResponse.success("Cập nhật lớp thành công", response));
    }

    @DeleteMapping("/{id}")
    @Operation(summary = "Delete class (soft delete)")
    public ResponseEntity<ApiResponse<Void>> deleteClass(@PathVariable UUID id) {
        classService.deleteClass(id);
        return ResponseEntity.ok(ApiResponse.success("Xóa lớp thành công", null));
    }
}
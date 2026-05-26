package com.quanlydaotao.backend.course.controller;

import com.quanlydaotao.backend.common.dto.ApiResponse;
import com.quanlydaotao.backend.course.dto.CreatePrerequisiteRequest;
import com.quanlydaotao.backend.course.dto.PrerequisiteDto;
import com.quanlydaotao.backend.course.service.CoursePrerequisiteService;
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
@RequestMapping("/api/v1/course-prerequisites")
@RequiredArgsConstructor
@Tag(name = "Quản lý môn tiên quyết", description = "API admin quản lý môn tiên quyết, song hành và tương đương")
public class CoursePrerequisiteController {

    private final CoursePrerequisiteService prerequisiteService;

    @GetMapping("/admin/course/{courseId}")
    @PreAuthorize("hasAnyRole('ADMIN','SUPER_ADMIN')")
    @Operation(summary = "Admin lấy danh sách môn liên quan của một môn học")
    public ResponseEntity<ApiResponse<List<PrerequisiteDto>>> getByCourse(@PathVariable UUID courseId) {
        return ResponseEntity.ok(ApiResponse.success(
                "Lấy danh sách môn liên quan thành công",
                prerequisiteService.getPrerequisitesByCourse(courseId)));
    }

    @PostMapping("/admin")
    @PreAuthorize("hasAnyRole('ADMIN','SUPER_ADMIN')")
    @Operation(summary = "Admin thêm môn tiên quyết, song hành hoặc đồng điều kiện")
    public ResponseEntity<ApiResponse<PrerequisiteDto>> add(@Valid @RequestBody CreatePrerequisiteRequest request) {
        return ResponseEntity.ok(ApiResponse.success(
                "Thêm quan hệ môn học thành công",
                prerequisiteService.addPrerequisite(request)));
    }

    @DeleteMapping("/admin")
    @PreAuthorize("hasAnyRole('ADMIN','SUPER_ADMIN')")
    @Operation(summary = "Admin xóa mềm quan hệ môn học")
    public ResponseEntity<ApiResponse<Void>> delete(@RequestParam UUID courseId, @RequestParam UUID prereqId) {
        prerequisiteService.deletePrerequisite(courseId, prereqId);
        return ResponseEntity.ok(ApiResponse.success("Xóa quan hệ môn học thành công", null));
    }

    @GetMapping("/admin/check")
    @PreAuthorize("hasAnyRole('ADMIN','SUPER_ADMIN')")
    @Operation(summary = "Admin kiểm tra quan hệ môn học đã tồn tại chưa")
    public ResponseEntity<ApiResponse<Boolean>> check(@RequestParam UUID courseId, @RequestParam UUID prereqId) {
        return ResponseEntity.ok(ApiResponse.success(
                "Kiểm tra quan hệ môn học thành công",
                prerequisiteService.checkExists(courseId, prereqId)));
    }
}

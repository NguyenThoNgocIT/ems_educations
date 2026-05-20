package com.quanlydaotao.backend.administrativeclass.controller;

import com.quanlydaotao.backend.common.dto.ApiResponse;
import com.quanlydaotao.backend.administrativeclass.dto.AdministrativeClassRequest;
import com.quanlydaotao.backend.administrativeclass.dto.AdministrativeClassResponse;
import com.quanlydaotao.backend.administrativeclass.service.AdministrativeClassService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/v1/classes")
@RequiredArgsConstructor
@Tag(name = "Quản lý lớp hành chính", description = "API admin quản lý lớp hành chính theo khoa và niên khóa")
public class AdministrativeClassController {
    private final AdministrativeClassService administrativeClassService;

    @GetMapping("/admin")
    @PreAuthorize("hasAnyRole('ADMIN','SUPER_ADMIN')")
    @Operation(summary = "Admin lấy danh sách lớp hành chính")
    public ResponseEntity<ApiResponse<List<AdministrativeClassResponse>>> searchClasses(
            @RequestParam(required = false) String keyword,
            @RequestParam(required = false) UUID departmentId,
            @RequestParam(required = false) UUID majorId,
            @RequestParam(required = false) UUID specializationId,
            @RequestParam(required = false) UUID academicCohortId,
            @RequestParam(required = false) String classPhase,
            @RequestParam(required = false) Boolean isActive) {
        return ResponseEntity.ok(ApiResponse.success("Lấy danh sách lớp hành chính thành công",
                administrativeClassService.searchClasses(keyword, departmentId, majorId, specializationId, academicCohortId, classPhase, isActive)));
    }

    @GetMapping("/admin/{id}")
    @PreAuthorize("hasAnyRole('ADMIN','SUPER_ADMIN')")
    @Operation(summary = "Admin lấy chi tiết lớp hành chính")
    public ResponseEntity<ApiResponse<AdministrativeClassResponse>> getClass(@PathVariable UUID id) {
        return ResponseEntity.ok(ApiResponse.success("Lấy lớp hành chính thành công", administrativeClassService.getClass(id)));
    }

    @PostMapping("/admin")
    @PreAuthorize("hasAnyRole('ADMIN','SUPER_ADMIN')")
    @Operation(summary = "Admin tạo lớp hành chính")
    public ResponseEntity<ApiResponse<AdministrativeClassResponse>> createClass(@RequestBody AdministrativeClassRequest request) {
        return ResponseEntity.ok(ApiResponse.success("Tạo lớp hành chính thành công", administrativeClassService.createClass(request)));
    }

    @PutMapping("/admin/{id}")
    @PreAuthorize("hasAnyRole('ADMIN','SUPER_ADMIN')")
    @Operation(summary = "Admin cập nhật lớp hành chính")
    public ResponseEntity<ApiResponse<AdministrativeClassResponse>> updateClass(@PathVariable UUID id,
                                                                                @RequestBody AdministrativeClassRequest request) {
        return ResponseEntity.ok(ApiResponse.success("Cập nhật lớp hành chính thành công",
                administrativeClassService.updateClass(id, request)));
    }

    @DeleteMapping("/admin/{id}")
    @PreAuthorize("hasAnyRole('ADMIN','SUPER_ADMIN')")
    @Operation(summary = "Admin xóa mềm lớp hành chính")
    public ResponseEntity<ApiResponse<Void>> deleteClass(@PathVariable UUID id) {
        administrativeClassService.deleteClass(id);
        return ResponseEntity.ok(ApiResponse.success("Xóa lớp hành chính thành công", null));
    }
}

package com.quanlydaotao.backend.specialization.controller;

import com.quanlydaotao.backend.common.dto.ApiResponse;
import com.quanlydaotao.backend.specialization.dto.SpecializationRequest;
import com.quanlydaotao.backend.specialization.dto.SpecializationResponse;
import com.quanlydaotao.backend.specialization.service.SpecializationService;
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
@RequestMapping("/api/v1/specializations")
@RequiredArgsConstructor
@Tag(name = "Quản lý chuyên ngành", description = "API admin quản lý chuyên ngành theo khoa và ngành")
public class SpecializationController {
    private final SpecializationService specializationService;

    @GetMapping("/admin")
    @PreAuthorize("hasAnyRole('ADMIN','SUPER_ADMIN')")
    @Operation(summary = "Admin lấy danh sách chuyên ngành")
    public ResponseEntity<ApiResponse<List<SpecializationResponse>>> search(
            @RequestParam(required = false) String keyword,
            @RequestParam(required = false) UUID departmentId,
            @RequestParam(required = false) UUID majorId,
            @RequestParam(required = false) Boolean isActive) {
        return ResponseEntity.ok(ApiResponse.success("Lấy danh sách chuyên ngành thành công",
                specializationService.search(keyword, departmentId, majorId, isActive)));
    }

    @GetMapping("/admin/{id}")
    @PreAuthorize("hasAnyRole('ADMIN','SUPER_ADMIN')")
    @Operation(summary = "Admin lấy chi tiết chuyên ngành")
    public ResponseEntity<ApiResponse<SpecializationResponse>> get(@PathVariable UUID id) {
        return ResponseEntity.ok(ApiResponse.success("Lấy chuyên ngành thành công", specializationService.getSpecialization(id)));
    }

    @PostMapping("/admin")
    @PreAuthorize("hasAnyRole('ADMIN','SUPER_ADMIN')")
    @Operation(summary = "Admin tạo chuyên ngành")
    public ResponseEntity<ApiResponse<SpecializationResponse>> create(@Valid @RequestBody SpecializationRequest request) {
        return ResponseEntity.ok(ApiResponse.success("Tạo chuyên ngành thành công", specializationService.createSpecialization(request)));
    }

    @PutMapping("/admin/{id}")
    @PreAuthorize("hasAnyRole('ADMIN','SUPER_ADMIN')")
    @Operation(summary = "Admin cập nhật chuyên ngành")
    public ResponseEntity<ApiResponse<SpecializationResponse>> update(@PathVariable UUID id,
                                                                      @RequestBody SpecializationRequest request) {
        return ResponseEntity.ok(ApiResponse.success("Cập nhật chuyên ngành thành công",
                specializationService.updateSpecialization(id, request)));
    }

    @DeleteMapping("/admin/{id}")
    @PreAuthorize("hasAnyRole('ADMIN','SUPER_ADMIN')")
    @Operation(summary = "Admin xóa mềm chuyên ngành")
    public ResponseEntity<ApiResponse<Void>> delete(@PathVariable UUID id) {
        specializationService.deleteSpecialization(id);
        return ResponseEntity.ok(ApiResponse.success("Xóa chuyên ngành thành công", null));
    }
}

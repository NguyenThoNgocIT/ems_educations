package com.quanlydaotao.backend.degree.controller;

import com.quanlydaotao.backend.common.dto.ApiResponse;
import com.quanlydaotao.backend.degree.dto.DegreeDto;
import com.quanlydaotao.backend.degree.service.DegreeService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/v1/degrees")
@RequiredArgsConstructor
@Tag(name = "Quản lý trình độ", description = "API admin quản lý trình độ, học vị và học hàm")
public class DegreeController {
    private final DegreeService degreeService;

    @GetMapping("/admin")
    @PreAuthorize("hasAnyRole('ADMIN','SUPER_ADMIN')")
    @Operation(summary = "Admin lấy danh sách trình độ")
    public ResponseEntity<ApiResponse<List<DegreeDto>>> searchDegrees(
            @RequestParam(required = false) String keyword,
            @RequestParam(required = false) UUID majorId,
            @RequestParam(required = false) Boolean isActive) {
        return ResponseEntity.ok(ApiResponse.success("Lấy danh sách trình độ thành công",
                degreeService.searchDegrees(keyword, majorId, isActive)));
    }

    @GetMapping("/admin/{id}")
    @PreAuthorize("hasAnyRole('ADMIN','SUPER_ADMIN')")
    @Operation(summary = "Admin lấy chi tiết trình độ")
    public ResponseEntity<ApiResponse<DegreeDto>> getDegree(@PathVariable UUID id) {
        return ResponseEntity.ok(ApiResponse.success("Lấy trình độ thành công", degreeService.getDegree(id)));
    }

    @PostMapping("/admin")
    @PreAuthorize("hasAnyRole('ADMIN','SUPER_ADMIN')")
    @Operation(summary = "Admin tạo trình độ")
    public ResponseEntity<ApiResponse<DegreeDto>> createDegree(@RequestBody DegreeDto request) {
        return ResponseEntity.ok(ApiResponse.success("Tạo trình độ thành công", degreeService.createDegree(request)));
    }

    @PutMapping("/admin/{id}")
    @PreAuthorize("hasAnyRole('ADMIN','SUPER_ADMIN')")
    @Operation(summary = "Admin cập nhật trình độ")
    public ResponseEntity<ApiResponse<DegreeDto>> updateDegree(@PathVariable UUID id, @RequestBody DegreeDto request) {
        return ResponseEntity.ok(ApiResponse.success("Cập nhật trình độ thành công", degreeService.updateDegree(id, request)));
    }

    @DeleteMapping("/admin/{id}")
    @PreAuthorize("hasAnyRole('ADMIN','SUPER_ADMIN')")
    @Operation(summary = "Admin xóa mềm trình độ")
    public ResponseEntity<ApiResponse<Void>> deleteDegree(@PathVariable UUID id) {
        degreeService.deleteDegree(id);
        return ResponseEntity.ok(ApiResponse.success("Xóa trình độ thành công", null));
    }
}

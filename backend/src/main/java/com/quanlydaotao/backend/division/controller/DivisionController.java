package com.quanlydaotao.backend.division.controller;

import com.quanlydaotao.backend.common.dto.ApiResponse;
import com.quanlydaotao.backend.division.dto.DivisionDto;
import com.quanlydaotao.backend.division.service.DivisionService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/v1/divisions")
@RequiredArgsConstructor
@Tag(name = "Quản lý phòng ban", description = "API admin quản lý phòng ban")
public class DivisionController {
    private final DivisionService divisionService;

    @GetMapping("/admin")
    @PreAuthorize("hasAnyRole('ADMIN','SUPER_ADMIN') or @rbacPermissionEvaluator.hasCurrentRequestPermission(authentication)")
    @Operation(summary = "Admin lấy danh sách phòng ban")
    public ResponseEntity<ApiResponse<List<DivisionDto>>> searchDivisions(
            @RequestParam(required = false) String keyword,
            @RequestParam(required = false) Boolean isActive) {
        return ResponseEntity.ok(ApiResponse.success("Lấy danh sách phòng ban thành công",
                divisionService.searchDivisions(keyword, isActive)));
    }

    @GetMapping("/admin/{id}")
    @PreAuthorize("hasAnyRole('ADMIN','SUPER_ADMIN') or @rbacPermissionEvaluator.hasCurrentRequestPermission(authentication)")
    @Operation(summary = "Admin lấy chi tiết phòng ban")
    public ResponseEntity<ApiResponse<DivisionDto>> getDivision(@PathVariable UUID id) {
        return ResponseEntity.ok(ApiResponse.success("Lấy phòng ban thành công", divisionService.getDivision(id)));
    }

    @PostMapping("/admin")
    @PreAuthorize("hasAnyRole('ADMIN','SUPER_ADMIN') or @rbacPermissionEvaluator.hasCurrentRequestPermission(authentication)")
    @Operation(summary = "Admin tạo phòng ban")
    public ResponseEntity<ApiResponse<DivisionDto>> createDivision(@RequestBody DivisionDto request) {
        return ResponseEntity.ok(ApiResponse.success("Tạo phòng ban thành công", divisionService.createDivision(request)));
    }

    @PutMapping("/admin/{id}")
    @PreAuthorize("hasAnyRole('ADMIN','SUPER_ADMIN') or @rbacPermissionEvaluator.hasCurrentRequestPermission(authentication)")
    @Operation(summary = "Admin cập nhật phòng ban")
    public ResponseEntity<ApiResponse<DivisionDto>> updateDivision(@PathVariable UUID id, @RequestBody DivisionDto request) {
        return ResponseEntity.ok(ApiResponse.success("Cập nhật phòng ban thành công", divisionService.updateDivision(id, request)));
    }

    @DeleteMapping("/admin/{id}")
    @PreAuthorize("hasAnyRole('ADMIN','SUPER_ADMIN') or @rbacPermissionEvaluator.hasCurrentRequestPermission(authentication)")
    @Operation(summary = "Admin xóa mềm phòng ban")
    public ResponseEntity<ApiResponse<Void>> deleteDivision(@PathVariable UUID id) {
        divisionService.deleteDivision(id);
        return ResponseEntity.ok(ApiResponse.success("Xóa phòng ban thành công", null));
    }
}

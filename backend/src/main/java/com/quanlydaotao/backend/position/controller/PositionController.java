package com.quanlydaotao.backend.position.controller;

import com.quanlydaotao.backend.common.dto.ApiResponse;
import com.quanlydaotao.backend.position.dto.PositionDto;
import com.quanlydaotao.backend.position.service.PositionService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/v1/positions")
@RequiredArgsConstructor
@Tag(name = "Quản lý chức vụ", description = "API admin quản lý chức vụ theo phòng ban")
public class PositionController {
    private final PositionService positionService;

    @GetMapping("/admin")
    @PreAuthorize("hasAnyRole('ADMIN','SUPER_ADMIN')")
    @Operation(summary = "Admin lấy danh sách chức vụ")
    public ResponseEntity<ApiResponse<List<PositionDto>>> searchPositions(
            @RequestParam(required = false) String keyword,
            @RequestParam(required = false) UUID divisionId,
            @RequestParam(required = false) Boolean isActive) {
        return ResponseEntity.ok(ApiResponse.success("Lấy danh sách chức vụ thành công",
                positionService.searchPositions(keyword, divisionId, isActive)));
    }

    @GetMapping("/admin/{id}")
    @PreAuthorize("hasAnyRole('ADMIN','SUPER_ADMIN')")
    @Operation(summary = "Admin lấy chi tiết chức vụ")
    public ResponseEntity<ApiResponse<PositionDto>> getPosition(@PathVariable UUID id) {
        return ResponseEntity.ok(ApiResponse.success("Lấy chức vụ thành công", positionService.getPosition(id)));
    }

    @PostMapping("/admin")
    @PreAuthorize("hasAnyRole('ADMIN','SUPER_ADMIN')")
    @Operation(summary = "Admin tạo chức vụ")
    public ResponseEntity<ApiResponse<PositionDto>> createPosition(@RequestBody PositionDto request) {
        return ResponseEntity.ok(ApiResponse.success("Tạo chức vụ thành công", positionService.createPosition(request)));
    }

    @PutMapping("/admin/{id}")
    @PreAuthorize("hasAnyRole('ADMIN','SUPER_ADMIN')")
    @Operation(summary = "Admin cập nhật chức vụ")
    public ResponseEntity<ApiResponse<PositionDto>> updatePosition(@PathVariable UUID id, @RequestBody PositionDto request) {
        return ResponseEntity.ok(ApiResponse.success("Cập nhật chức vụ thành công", positionService.updatePosition(id, request)));
    }

    @DeleteMapping("/admin/{id}")
    @PreAuthorize("hasAnyRole('ADMIN','SUPER_ADMIN')")
    @Operation(summary = "Admin xóa mềm chức vụ")
    public ResponseEntity<ApiResponse<Void>> deletePosition(@PathVariable UUID id) {
        positionService.deletePosition(id);
        return ResponseEntity.ok(ApiResponse.success("Xóa chức vụ thành công", null));
    }
}

package com.quanlydaotao.backend.facility.controller;

import com.quanlydaotao.backend.common.dto.ApiResponse;
import com.quanlydaotao.backend.facility.dto.BuildingDto;
import com.quanlydaotao.backend.facility.service.BuildingService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/v1/buildings")
@RequiredArgsConstructor
@Tag(name = "Tòa nhà", description = "API quản lý các tòa nhà trong khuôn viên trường")
public class BuildingController {

    private final BuildingService buildingService;

    @GetMapping
    @Operation(summary = "Lấy danh sách tất cả tòa nhà")
    public ResponseEntity<ApiResponse<List<BuildingDto>>> getAll() {
        return ResponseEntity.ok(ApiResponse.success(buildingService.getAll()));
    }

    @GetMapping("/{id}")
    @Operation(summary = "Lấy thông tin chi tiết tòa nhà theo ID")
    public ResponseEntity<ApiResponse<BuildingDto>> getById(@PathVariable UUID id) {
        return ResponseEntity.ok(ApiResponse.success(buildingService.getById(id)));
    }

    @PostMapping
    @Operation(summary = "Tạo mới tòa nhà")
    public ResponseEntity<ApiResponse<BuildingDto>> create(@RequestBody BuildingDto dto) {
        return ResponseEntity.ok(ApiResponse.success("Tạo tòa nhà thành công", buildingService.create(dto)));
    }

    @PutMapping("/{id}")
    @Operation(summary = "Cập nhật thông tin tòa nhà")
    public ResponseEntity<ApiResponse<BuildingDto>> update(@PathVariable UUID id, @RequestBody BuildingDto dto) {
        return ResponseEntity.ok(ApiResponse.success("Cập nhật tòa nhà thành công", buildingService.update(id, dto)));
    }

    @DeleteMapping("/{id}")
    @Operation(summary = "Xóa tòa nhà")
    public ResponseEntity<ApiResponse<Void>> delete(@PathVariable UUID id) {
        buildingService.delete(id);
        return ResponseEntity.ok(ApiResponse.success("Xóa tòa nhà thành công", null));
    }
}

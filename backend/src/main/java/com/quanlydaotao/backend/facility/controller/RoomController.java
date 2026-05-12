package com.quanlydaotao.backend.facility.controller;

import com.quanlydaotao.backend.common.dto.ApiResponse;
import com.quanlydaotao.backend.facility.dto.RoomDto;
import com.quanlydaotao.backend.facility.service.RoomService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/v1/rooms")
@RequiredArgsConstructor
@Tag(name = "Phòng học", description = "API quản lý phòng học và trang thiết bị")
public class RoomController {

    private final RoomService roomService;

    @GetMapping
    @Operation(summary = "Lấy danh sách tất cả phòng học")
    public ResponseEntity<ApiResponse<List<RoomDto>>> getAll() {
        return ResponseEntity.ok(ApiResponse.success(roomService.getAll()));
    }

    @GetMapping("/{id}")
    @Operation(summary = "Lấy thông tin chi tiết phòng học theo ID")
    public ResponseEntity<ApiResponse<RoomDto>> getById(@PathVariable UUID id) {
        return ResponseEntity.ok(ApiResponse.success(roomService.getById(id)));
    }

    @PostMapping
    @Operation(summary = "Tạo mới phòng học")
    public ResponseEntity<ApiResponse<RoomDto>> create(@RequestBody RoomDto dto) {
        return ResponseEntity.ok(ApiResponse.success("Tạo phòng học thành công", roomService.create(dto)));
    }

    @PutMapping("/{id}")
    @Operation(summary = "Cập nhật thông tin phòng học")
    public ResponseEntity<ApiResponse<RoomDto>> update(@PathVariable UUID id, @RequestBody RoomDto dto) {
        return ResponseEntity.ok(ApiResponse.success("Cập nhật phòng học thành công", roomService.update(id, dto)));
    }

    @DeleteMapping("/{id}")
    @Operation(summary = "Xóa phòng học")
    public ResponseEntity<ApiResponse<Void>> delete(@PathVariable UUID id) {
        roomService.delete(id);
        return ResponseEntity.ok(ApiResponse.success("Xóa phòng học thành công", null));
    }
}

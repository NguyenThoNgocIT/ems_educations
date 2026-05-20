package com.quanlydaotao.backend.scheduling.controller;

import com.quanlydaotao.backend.common.dto.ApiResponse;
import com.quanlydaotao.backend.scheduling.dto.TimeSlotDto;
import com.quanlydaotao.backend.scheduling.service.TimeSlotService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/v1/time-slots")
@RequiredArgsConstructor
@Tag(name = "Ca học", description = "API quản lý các ca học (Time Slots)")
public class TimeSlotController {

    private final TimeSlotService timeSlotService;

    @GetMapping
    @Operation(summary = "Lấy danh sách tất cả ca học")
    public ResponseEntity<ApiResponse<List<TimeSlotDto>>> getAll() {
        return ResponseEntity.ok(ApiResponse.success(timeSlotService.getAll()));
    }

    @GetMapping("/{id}")
    @Operation(summary = "Lấy thông tin chi tiết ca học theo ID")
    public ResponseEntity<ApiResponse<TimeSlotDto>> getById(@PathVariable UUID id) {
        return ResponseEntity.ok(ApiResponse.success(timeSlotService.getById(id)));
    }

    @PostMapping
    @Operation(summary = "Tạo mới ca học")
    public ResponseEntity<ApiResponse<TimeSlotDto>> create(@Valid @RequestBody TimeSlotDto dto) {
        return ResponseEntity.ok(ApiResponse.success("Tạo ca học thành công", timeSlotService.create(dto)));
    }

    @PutMapping("/{id}")
    @Operation(summary = "Cập nhật thông tin ca học")
    public ResponseEntity<ApiResponse<TimeSlotDto>> update(@PathVariable UUID id, @Valid @RequestBody TimeSlotDto dto) {
        return ResponseEntity.ok(ApiResponse.success("Cập nhật ca học thành công", timeSlotService.update(id, dto)));
    }

    @DeleteMapping("/{id}")
    @Operation(summary = "Xóa ca học")
    public ResponseEntity<ApiResponse<Void>> delete(@PathVariable UUID id) {
        timeSlotService.delete(id);
        return ResponseEntity.ok(ApiResponse.success("Xóa ca học thành công", null));
    }
}
package com.quanlydaotao.backend.scheduling.controller;

import com.quanlydaotao.backend.common.dto.ApiResponse;
import com.quanlydaotao.backend.scheduling.dto.ScheduleDto;
import com.quanlydaotao.backend.scheduling.service.ScheduleService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/v1/schedules")
@RequiredArgsConstructor
@Tag(name = "Lịch học", description = "API quản lý lịch học, sắp lịch và chống trùng lịch")
public class ScheduleController {

    private final ScheduleService scheduleService;

    @GetMapping
    @Operation(summary = "Lấy danh sách tất cả lịch học")
    public ResponseEntity<ApiResponse<List<ScheduleDto>>> getAll() {
        return ResponseEntity.ok(ApiResponse.success(scheduleService.getAll()));
    }

    @GetMapping("/course-class/{id}")
    @Operation(summary = "Lấy lịch học theo lớp học phần")
    public ResponseEntity<ApiResponse<List<ScheduleDto>>> getByCourseClass(@PathVariable UUID id) {
        return ResponseEntity.ok(ApiResponse.success(scheduleService.getByCourseClass(id)));
    }

    @GetMapping("/instructor/{id}")
    @Operation(summary = "Lấy lịch học theo giảng viên")
    public ResponseEntity<ApiResponse<List<ScheduleDto>>> getByInstructor(@PathVariable UUID id) {
        return ResponseEntity.ok(ApiResponse.success(scheduleService.getByInstructor(id)));
    }

    @GetMapping("/room/{id}")
    @Operation(summary = "Lấy lịch học theo phòng học")
    public ResponseEntity<ApiResponse<List<ScheduleDto>>> getByRoom(@PathVariable UUID id) {
        return ResponseEntity.ok(ApiResponse.success(scheduleService.getByRoom(id)));
    }

    @PostMapping
    @Operation(summary = "Tạo mới lịch học (Có kiểm tra trùng lịch)")
    public ResponseEntity<ApiResponse<ScheduleDto>> create(@RequestBody ScheduleDto dto) {
        return ResponseEntity.ok(ApiResponse.success("Sắp lịch thành công", scheduleService.create(dto)));
    }

    @PutMapping("/{id}")
    @Operation(summary = "Cập nhật lịch học (Có kiểm tra trùng lịch)")
    public ResponseEntity<ApiResponse<ScheduleDto>> update(@PathVariable UUID id, @RequestBody ScheduleDto dto) {
        return ResponseEntity.ok(ApiResponse.success("Cập nhật lịch thành công", scheduleService.update(id, dto)));
    }

    @DeleteMapping("/{id}")
    @Operation(summary = "Xóa lịch học")
    public ResponseEntity<ApiResponse<Void>> delete(@PathVariable UUID id) {
        scheduleService.delete(id);
        return ResponseEntity.ok(ApiResponse.success("Xóa lịch học thành công", null));
    }
}

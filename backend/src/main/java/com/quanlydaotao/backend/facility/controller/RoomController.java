package com.quanlydaotao.backend.facility.controller;

import com.quanlydaotao.backend.common.dto.ApiResponse;
import com.quanlydaotao.backend.facility.dto.RoomDto;
import com.quanlydaotao.backend.facility.service.RoomService;
import com.quanlydaotao.backend.scheduling.dto.AvailableRoomResponse;
import com.quanlydaotao.backend.scheduling.service.ScheduleQueryService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.time.LocalDate;
import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/v1/rooms")
@RequiredArgsConstructor
@Tag(name = "Phòng học", description = "API quản lý phòng học và tra cứu phòng trống")
public class RoomController {

    private final RoomService roomService;
    private final ScheduleQueryService scheduleQueryService;

    @GetMapping
    @Operation(summary = "Lấy danh sách tất cả phòng học")
    public ResponseEntity<ApiResponse<List<RoomDto>>> getAll() {
        return ResponseEntity.ok(ApiResponse.success(roomService.getAll()));
    }

    @GetMapping("/available")
    @Operation(summary = "Tra cứu phòng trống theo ngày, ca/tiết và sức chứa")
    public ResponseEntity<ApiResponse<List<AvailableRoomResponse>>> getAvailableRooms(
            @RequestParam LocalDate date,
            @RequestParam UUID timeSlotId,
            @RequestParam(required = false) Integer minCapacity,
            @RequestParam(required = false) UUID buildingId) {
        return ResponseEntity.ok(ApiResponse.success("Lấy danh sách phòng trống thành công",
                scheduleQueryService.getAvailableRooms(date, timeSlotId, minCapacity, buildingId)));
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

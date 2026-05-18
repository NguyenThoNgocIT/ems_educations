package com.quanlydaotao.backend.instructor.controller;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.quanlydaotao.backend.instructor.dto.InstructorCreateRequest;
import com.quanlydaotao.backend.instructor.dto.InstructorProfileDto;
import com.quanlydaotao.backend.instructor.dto.InstructorUpdateRequest;
import com.quanlydaotao.backend.instructor.service.InstructorService;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/v1/lecturers")
@RequiredArgsConstructor
@Tag(name = "Quản lý Giảng viên", description = "Các API cho phép thực hiện CRUD thông tin giảng viên")
public class InstructorController {
    private final InstructorService lecturerService;
    @PostMapping
    @Operation(summary = "Tạo mới giảng viên", description = "Lưu hồ sơ một giảng viên mới")
    public ResponseEntity<InstructorProfileDto> createLecturer(@RequestBody InstructorCreateRequest request) {
        return new ResponseEntity<>(lecturerService.createLecturer(request), HttpStatus.CREATED);
    }
    @GetMapping("/{id}")
    @Operation(summary = "Lấy chi tiết giảng viên", description = "Lấy thông tin chi tiết qua UUID")
    public ResponseEntity<InstructorProfileDto> getLecturerById(@PathVariable UUID id) {
        return ResponseEntity.ok(lecturerService.getLecturerById(id));
    }
    @GetMapping
    @Operation(summary = "Danh sách giảng viên", description = "Lấy toàn bộ danh sách giảng viên")
    public ResponseEntity<List<InstructorProfileDto>> getAllLecturers() {
        return ResponseEntity.ok(lecturerService.getAllLecturers());
    }
    @PutMapping("/{id}")
    @Operation(summary = "Cập nhật giảng viên", description = "Cập nhật thông tin giảng viên")
    public ResponseEntity<InstructorProfileDto> updateLecturer(@PathVariable UUID id, @RequestBody InstructorUpdateRequest request) {
        return ResponseEntity.ok(lecturerService.updateLecturer(id, request));
    }
    @DeleteMapping("/{id}")
    @Operation(summary = "Xóa giảng viên", description = "Xóa (ẩn) giảng viên khỏi hệ thống")
    public ResponseEntity<Void> deleteLecturer(@PathVariable UUID id) {
        lecturerService.deleteLecturer(id);
        return ResponseEntity.noContent().build();
    }
}


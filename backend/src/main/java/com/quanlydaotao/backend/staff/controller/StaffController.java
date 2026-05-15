package com.quanlydaotao.backend.staff.controller;
import com.quanlydaotao.backend.common.dto.ApiResponse;
import com.quanlydaotao.backend.staff.dto.StaffDto;
import com.quanlydaotao.backend.staff.service.StaffService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.UUID;
@RestController
@RequestMapping("/api/v1/staffs")
@RequiredArgsConstructor
@Tag(name = "Quản lý nhân viên")
public class StaffController {
    private final StaffService staffService;
    @GetMapping("/{id}")
    @Operation(summary = "Lấy thông tin nhân viên theo ID")
    public ResponseEntity<ApiResponse<StaffDto>> getStaffById(@PathVariable UUID id) {
        return ResponseEntity.ok(ApiResponse.success(staffService.getStaffById(id)));
    }
    @GetMapping
    @Operation(summary = "Lấy danh sách nhân viên")
    public ResponseEntity<ApiResponse<Page<StaffDto>>> getAllStaff(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {
        return ResponseEntity.ok(ApiResponse.success(staffService.getAllStaff(PageRequest.of(page, size))));
    }
}

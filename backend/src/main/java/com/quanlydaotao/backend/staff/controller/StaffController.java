package com.quanlydaotao.backend.staff.controller;

import com.quanlydaotao.backend.account.dto.AccountCreationResponse;
import com.quanlydaotao.backend.common.dto.ApiResponse;
import com.quanlydaotao.backend.staff.dto.StaffAdminCreateRequest;
import com.quanlydaotao.backend.staff.dto.StaffAdminResponse;
import com.quanlydaotao.backend.staff.dto.StaffAdminUpdateRequest;
import com.quanlydaotao.backend.staff.dto.StaffSelfResponse;
import com.quanlydaotao.backend.staff.dto.StaffSelfUpdateRequest;
import com.quanlydaotao.backend.staff.service.StaffService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/v1/staffs")
@RequiredArgsConstructor
@Tag(name = "Quản lý nhân viên hành chính", description = "API quản trị và tự quản lý thông tin nhân viên hành chính")
public class StaffController {
    private final StaffService staffService;

    @PostMapping("/admin")
    @PreAuthorize("hasAnyRole('ADMIN','SUPER_ADMIN')")
    @Operation(summary = "Admin tạo nhân viên hành chính và tài khoản đăng nhập")
    public ResponseEntity<ApiResponse<AccountCreationResponse>> createStaffForAdmin(
            @Valid @RequestBody StaffAdminCreateRequest request) {
        return ResponseEntity.ok(ApiResponse.success("Tạo nhân viên hành chính và tài khoản thành công", staffService.createStaffForAdmin(request)));
    }

    @GetMapping("/admin")
    @PreAuthorize("hasAnyRole('ADMIN','SUPER_ADMIN')")
    @Operation(summary = "Admin lấy danh sách nhân viên hành chính")
    public ResponseEntity<ApiResponse<List<StaffAdminResponse>>> getAllStaffsForAdmin() {
        return ResponseEntity.ok(ApiResponse.success("Lấy danh sách nhân viên hành chính thành công", staffService.getAllStaffsForAdmin()));
    }

    @GetMapping("/admin/{id}")
    @PreAuthorize("hasAnyRole('ADMIN','SUPER_ADMIN')")
    @Operation(summary = "Admin lấy chi tiết nhân viên hành chính")
    public ResponseEntity<ApiResponse<StaffAdminResponse>> getStaffForAdmin(@PathVariable UUID id) {
        return ResponseEntity.ok(ApiResponse.success("Lấy thông tin nhân viên hành chính thành công", staffService.getStaffForAdmin(id)));
    }

    @PutMapping("/admin/{id}")
    @PreAuthorize("hasAnyRole('ADMIN','SUPER_ADMIN')")
    @Operation(summary = "Admin cập nhật toàn bộ thông tin nhân viên hành chính")
    public ResponseEntity<ApiResponse<StaffAdminResponse>> updateStaffForAdmin(
            @PathVariable UUID id,
            @RequestBody StaffAdminUpdateRequest request) {
        return ResponseEntity.ok(ApiResponse.success("Cập nhật nhân viên hành chính thành công", staffService.updateStaffForAdmin(id, request)));
    }

    @DeleteMapping("/admin/{id}")
    @PreAuthorize("hasAnyRole('ADMIN','SUPER_ADMIN')")
    @Operation(summary = "Admin xóa mềm nhân viên hành chính")
    public ResponseEntity<ApiResponse<Void>> deleteStaffForAdmin(@PathVariable UUID id) {
        staffService.deleteStaffForAdmin(id);
        return ResponseEntity.ok(ApiResponse.success("Xóa nhân viên hành chính thành công", null));
    }

    @GetMapping("/me")
    @PreAuthorize("hasRole('STAFF')")
    @Operation(summary = "Nhân viên hành chính xem thông tin của chính mình")
    public ResponseEntity<ApiResponse<StaffSelfResponse>> getCurrentStaff(Authentication authentication) {
        return ResponseEntity.ok(ApiResponse.success("Lấy thông tin nhân viên hành chính thành công", staffService.getCurrentStaff(authentication.getName())));
    }

    @PutMapping("/me")
    @PreAuthorize("hasRole('STAFF')")
    @Operation(summary = "Nhân viên hành chính cập nhật thông tin cá nhân trong bảng Persons")
    public ResponseEntity<ApiResponse<StaffSelfResponse>> updateCurrentStaff(
            Authentication authentication,
            @RequestBody StaffSelfUpdateRequest request) {
        return ResponseEntity.ok(ApiResponse.success("Cập nhật thông tin cá nhân thành công", staffService.updateCurrentStaff(authentication.getName(), request)));
    }
}

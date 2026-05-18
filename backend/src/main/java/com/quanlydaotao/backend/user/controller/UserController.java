package com.quanlydaotao.backend.user.controller;

import com.quanlydaotao.backend.common.dto.ApiResponse;
import com.quanlydaotao.backend.user.dto.LockUserAdminRequest;
import com.quanlydaotao.backend.user.dto.UpdateUserAdminRequest;
import com.quanlydaotao.backend.user.dto.UserAdminResponse;
import com.quanlydaotao.backend.user.entity.UserSession;
import com.quanlydaotao.backend.user.service.UserService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/v1/users")
@RequiredArgsConstructor
@Tag(name = "Quản lý người dùng", description = "API quản trị tài khoản đăng nhập dành cho admin")
public class UserController {
    private final UserService userService;

    @GetMapping("/admin")
    @PreAuthorize("hasAnyRole('ADMIN','SUPER_ADMIN')")
    @Operation(summary = "Admin tìm kiếm danh sách tài khoản")
    public ResponseEntity<ApiResponse<Page<UserAdminResponse>>> searchUsersForAdmin(
            @RequestParam(required = false) String keyword,
            @RequestParam(required = false) Boolean isActive,
            @RequestParam(required = false) Boolean isLocked,
            Pageable pageable) {
        return ResponseEntity.ok(ApiResponse.success("Lấy danh sách tài khoản thành công", userService.searchUsersForAdmin(keyword, isActive, isLocked, pageable)));
    }

    @GetMapping("/admin/{id}")
    @PreAuthorize("hasAnyRole('ADMIN','SUPER_ADMIN')")
    @Operation(summary = "Admin lấy chi tiết tài khoản")
    public ResponseEntity<ApiResponse<UserAdminResponse>> getUserForAdmin(@PathVariable UUID id) {
        return ResponseEntity.ok(ApiResponse.success("Lấy thông tin tài khoản thành công", userService.getUserForAdmin(id)));
    }

    @PutMapping("/admin/{id}")
    @PreAuthorize("hasAnyRole('ADMIN','SUPER_ADMIN')")
    @Operation(summary = "Admin cập nhật trạng thái và bảo mật tài khoản")
    public ResponseEntity<ApiResponse<UserAdminResponse>> updateUserForAdmin(
            @PathVariable UUID id,
            @RequestBody UpdateUserAdminRequest request) {
        return ResponseEntity.ok(ApiResponse.success("Cập nhật tài khoản thành công", userService.updateUserForAdmin(id, request)));
    }

    @DeleteMapping("/admin/{id}")
    @PreAuthorize("hasAnyRole('ADMIN','SUPER_ADMIN')")
    @Operation(summary = "Admin xóa mềm tài khoản")
    public ResponseEntity<ApiResponse<Void>> deleteUserForAdmin(@PathVariable UUID id) {
        userService.deleteUserForAdmin(id);
        return ResponseEntity.ok(ApiResponse.success("Xóa tài khoản thành công", null));
    }

    @PutMapping("/admin/{id}/lock")
    @PreAuthorize("hasAnyRole('ADMIN','SUPER_ADMIN')")
    @Operation(summary = "Admin khóa tài khoản")
    public ResponseEntity<ApiResponse<Void>> lockUser(@PathVariable UUID id, @RequestBody LockUserAdminRequest request) {
        userService.lockUser(id, request);
        return ResponseEntity.ok(ApiResponse.success("Khóa tài khoản thành công", null));
    }

    @PutMapping("/admin/{id}/unlock")
    @PreAuthorize("hasAnyRole('ADMIN','SUPER_ADMIN')")
    @Operation(summary = "Admin mở khóa tài khoản")
    public ResponseEntity<ApiResponse<Void>> unlockUser(@PathVariable UUID id) {
        userService.unlockUser(id);
        return ResponseEntity.ok(ApiResponse.success("Mở khóa tài khoản thành công", null));
    }

    @PutMapping("/admin/{id}/restore")
    @PreAuthorize("hasAnyRole('ADMIN','SUPER_ADMIN')")
    @Operation(summary = "Admin khôi phục tài khoản đã xóa mềm")
    public ResponseEntity<ApiResponse<Void>> restoreUser(@PathVariable UUID id) {
        userService.restoreUser(id);
        return ResponseEntity.ok(ApiResponse.success("Khôi phục tài khoản thành công", null));
    }

    @GetMapping("/admin/{id}/sessions")
    @PreAuthorize("hasAnyRole('ADMIN','SUPER_ADMIN')")
    @Operation(summary = "Admin lấy danh sách phiên đăng nhập của tài khoản")
    public ResponseEntity<ApiResponse<List<UserSession>>> getUserSessions(@PathVariable UUID id) {
        return ResponseEntity.ok(ApiResponse.success("Lấy danh sách phiên đăng nhập thành công", userService.getUserSessions(id)));
    }

    @DeleteMapping("/admin/{id}/sessions")
    @PreAuthorize("hasAnyRole('ADMIN','SUPER_ADMIN')")
    @Operation(summary = "Admin thu hồi toàn bộ phiên đăng nhập của tài khoản")
    public ResponseEntity<ApiResponse<Void>> revokeAllUserSessions(@PathVariable UUID id) {
        userService.revokeAllUserSessions(id);
        return ResponseEntity.ok(ApiResponse.success("Thu hồi các phiên thành công", null));
    }
}

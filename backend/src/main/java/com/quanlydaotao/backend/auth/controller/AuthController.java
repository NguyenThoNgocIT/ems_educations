package com.quanlydaotao.backend.auth.controller;

import com.quanlydaotao.backend.auth.dto.LoginRequest;
import com.quanlydaotao.backend.auth.dto.LoginResponse;
import com.quanlydaotao.backend.auth.dto.ChangePasswordRequest;
import com.quanlydaotao.backend.auth.dto.AuthMeResponse;
import com.quanlydaotao.backend.auth.service.AuthService;
import com.quanlydaotao.backend.common.dto.ApiResponse;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;
import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
@Tag(name = "Xác thực & Bảo mật", description = "Các API liên quan đến đăng nhập, đăng xuất và quản lý mật khẩu")
public class AuthController {

    private final AuthService authService;

    @PostMapping("/login")
    @Operation(summary = "Đăng nhập hệ thống", description = "Sử dụng username và password để nhận về Token truy cập")
    public ResponseEntity<ApiResponse<LoginResponse>> authenticateUser(@Valid @RequestBody LoginRequest loginRequest) {
        LoginResponse session = authService.authenticateUser(loginRequest);
        return ResponseEntity.ok(ApiResponse.success("Đăng nhập thành công", session));
    }

    @GetMapping("/me")
    @Operation(summary = "Lấy thông tin cá nhân", description = "Lấy thông tin chi tiết của người dùng đang đăng nhập từ Token")
    public ResponseEntity<ApiResponse<AuthMeResponse>> getMe() {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        String username = auth.getName();
        return ResponseEntity.ok(ApiResponse.success("Lấy thông tin thành công", authService.getMe(username)));
    }

    @PutMapping("/change-password")
    @Operation(summary = "Đổi mật khẩu", description = "Thay đổi mật khẩu cho người dùng hiện tại")
    public ResponseEntity<ApiResponse<String>> changePassword(@Valid @RequestBody ChangePasswordRequest request) {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        String username = auth.getName();
        authService.changePassword(username, request);
        return ResponseEntity.ok(ApiResponse.success("Đổi mật khẩu thành công", null));
    }

    @PostMapping("/logout")
    @Operation(summary = "Đăng xuất", description = "Hủy phiên làm việc hiện tại")
    public ResponseEntity<ApiResponse<String>> logout() {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        if (auth != null && auth.isAuthenticated() && !auth.getName().equals("anonymousUser")) {
            authService.logout(auth.getName());
        }
        return ResponseEntity.ok(ApiResponse.success("Đăng xuất thành công", null));
    }

    @PostMapping("/logout-all")
    @Operation(summary = "Đăng xuất tất cả", description = "Hủy toàn bộ các phiên làm việc trên mọi thiết bị")
    public ResponseEntity<ApiResponse<String>> logoutAll() {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        if (auth != null && auth.isAuthenticated() && !auth.getName().equals("anonymousUser")) {
            authService.logout(auth.getName()); // Current implementation revokes all
        }
        return ResponseEntity.ok(ApiResponse.success("Đăng xuất tất cả thiết bị thành công", null));
    }

    @PostMapping("/refresh")
    @Operation(summary = "Làm mới Token", description = "Sử dụng Refresh Token để lấy Access Token mới")
    public ResponseEntity<ApiResponse<String>> refresh(@Valid @RequestBody com.quanlydaotao.backend.auth.dto.RefreshTokenRequest request) {
        // Mock processing refresh token
        return ResponseEntity.ok(ApiResponse.success("Làm mới token thành công", "new-jwt-token-string"));
    }

    @PostMapping("/forgot-password")
    @Operation(summary = "Quên mật khẩu", description = "Gửi yêu cầu khôi phục mật khẩu")
    public ResponseEntity<ApiResponse<String>> forgotPassword(@RequestBody com.quanlydaotao.backend.auth.dto.ForgotPasswordRequest request) {
        // Mock gửi yêu cầu đến Admin
        return ResponseEntity.ok(ApiResponse.success("Đã gửi yêu cầu reset mật khẩu đến Admin", null));
    }

    @PostMapping("/reset-password")
    @Operation(summary = "Đặt lại mật khẩu (Admin)", description = "Admin thực hiện đặt lại mật khẩu cho người dùng")
    public ResponseEntity<ApiResponse<String>> resetPassword(@RequestBody com.quanlydaotao.backend.auth.dto.ResetPasswordRequest request) {
        // Admin goị API này (sau khi xác nhận), hệ thống tự gen mật khẩu, gửi email, và set requirePasswordChange = true
        // Lưu ý: Cần phân quyền Admin cho API này
        return ResponseEntity.ok(ApiResponse.success("Admin đã reset mật khẩu thành công. Mật khẩu mới đã gửi vào email.", null));
    }
}

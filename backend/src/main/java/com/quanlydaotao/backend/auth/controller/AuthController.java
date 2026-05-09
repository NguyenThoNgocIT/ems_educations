package com.quanlydaotao.backend.auth.controller;

import com.quanlydaotao.backend.auth.dto.LoginRequest;
import com.quanlydaotao.backend.auth.dto.LoginResponse;
import com.quanlydaotao.backend.auth.dto.ChangePasswordRequest;
import com.quanlydaotao.backend.auth.dto.AuthMeResponse;
import com.quanlydaotao.backend.auth.service.AuthService;
import com.quanlydaotao.backend.common.dto.ApiResponse;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
public class AuthController {

    private final AuthService authService;

    @PostMapping("/login")
    public ResponseEntity<ApiResponse<LoginResponse>> authenticateUser(@Valid @RequestBody LoginRequest loginRequest) {
        LoginResponse session = authService.authenticateUser(loginRequest);
        return ResponseEntity.ok(ApiResponse.success("Đăng nhập thành công", session));
    }

    @GetMapping("/me")
    public ResponseEntity<ApiResponse<AuthMeResponse>> getMe() {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        String username = auth.getName();
        return ResponseEntity.ok(ApiResponse.success("Lấy thông tin thành công", authService.getMe(username)));
    }

    @PutMapping("/change-password")
    public ResponseEntity<ApiResponse<String>> changePassword(@Valid @RequestBody ChangePasswordRequest request) {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        String username = auth.getName();
        authService.changePassword(username, request);
        return ResponseEntity.ok(ApiResponse.success("Đổi mật khẩu thành công", null));
    }

    @PostMapping("/logout")
    public ResponseEntity<ApiResponse<String>> logout() {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        if (auth != null && auth.isAuthenticated() && !auth.getName().equals("anonymousUser")) {
            authService.logout(auth.getName());
        }
        return ResponseEntity.ok(ApiResponse.success("Đăng xuất thành công", null));
    }

    @PostMapping("/logout-all")
    public ResponseEntity<ApiResponse<String>> logoutAll() {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        if (auth != null && auth.isAuthenticated() && !auth.getName().equals("anonymousUser")) {
            authService.logout(auth.getName()); // Current implementation revokes all
        }
        return ResponseEntity.ok(ApiResponse.success("Đăng xuất tất cả thiết bị thành công", null));
    }

    @PostMapping("/refresh")
    public ResponseEntity<ApiResponse<String>> refresh(@Valid @RequestBody com.quanlydaotao.backend.auth.dto.RefreshTokenRequest request) {
        // Mock processing refresh token
        return ResponseEntity.ok(ApiResponse.success("Làm mới token thành công", "new-jwt-token-string"));
    }

    @PostMapping("/forgot-password")
    public ResponseEntity<ApiResponse<String>> forgotPassword(@RequestBody com.quanlydaotao.backend.auth.dto.ForgotPasswordRequest request) {
        // Mock gửi yêu cầu đến Admin
        return ResponseEntity.ok(ApiResponse.success("Đã gửi yêu cầu reset mật khẩu đến Admin", null));
    }

    @PostMapping("/reset-password")
    public ResponseEntity<ApiResponse<String>> resetPassword(@RequestBody com.quanlydaotao.backend.auth.dto.ResetPasswordRequest request) {
        // Admin goị API này (sau khi xác nhận), hệ thống tự gen mật khẩu, gửi email, và set requirePasswordChange = true
        // Lưu ý: Cần phân quyền Admin cho API này
        return ResponseEntity.ok(ApiResponse.success("Admin đã reset mật khẩu thành công. Mật khẩu mới đã gửi vào email.", null));
    }
}

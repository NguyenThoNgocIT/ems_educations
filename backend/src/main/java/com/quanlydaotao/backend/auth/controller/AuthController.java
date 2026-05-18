package com.quanlydaotao.backend.auth.controller;

import com.quanlydaotao.backend.auth.dto.AdminResetPasswordResponse;
import com.quanlydaotao.backend.auth.dto.AuthMeResponse;
import com.quanlydaotao.backend.auth.dto.ChangePasswordRequest;
import com.quanlydaotao.backend.auth.dto.ForgotPasswordRequest;
import com.quanlydaotao.backend.auth.dto.LoginRequest;
import com.quanlydaotao.backend.auth.dto.LoginResponse;
import com.quanlydaotao.backend.auth.dto.PasswordResetRequestResponse;
import com.quanlydaotao.backend.auth.dto.RefreshTokenRequest;
import com.quanlydaotao.backend.auth.dto.ResetPasswordRequest;
import com.quanlydaotao.backend.auth.dto.SetPasswordByTokenRequest;
import com.quanlydaotao.backend.auth.service.AuthService;
import com.quanlydaotao.backend.common.dto.ApiResponse;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
@Tag(name = "Xác thực và bảo mật", description = "API đăng nhập, đổi mật khẩu, xác nhận email và yêu cầu quên mật khẩu")
public class AuthController {
    private final AuthService authService;

    @PostMapping("/login")
    @Operation(summary = "Đăng nhập hệ thống")
    public ResponseEntity<ApiResponse<LoginResponse>> authenticateUser(@Valid @RequestBody LoginRequest loginRequest) {
        return ResponseEntity.ok(ApiResponse.success("Đăng nhập thành công", authService.authenticateUser(loginRequest)));
    }

    @GetMapping("/me")
    @Operation(summary = "Lấy thông tin xác thực của người dùng hiện tại")
    public ResponseEntity<ApiResponse<AuthMeResponse>> getMe() {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        return ResponseEntity.ok(ApiResponse.success("Lấy thông tin thành công", authService.getMe(auth.getName())));
    }

    @PutMapping("/change-password")
    @Operation(summary = "Đổi mật khẩu cho người dùng hiện tại")
    public ResponseEntity<ApiResponse<Void>> changePassword(@Valid @RequestBody ChangePasswordRequest request) {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        authService.changePassword(auth.getName(), request);
        return ResponseEntity.ok(ApiResponse.success("Đổi mật khẩu thành công", null));
    }

    @PutMapping("/change-password-by-token")
    @Operation(summary = "Đổi mật khẩu bằng token xác nhận trong email")
    public ResponseEntity<ApiResponse<Void>> changePasswordByToken(@Valid @RequestBody SetPasswordByTokenRequest request) {
        authService.setPasswordByToken(request);
        return ResponseEntity.ok(ApiResponse.success("Đổi mật khẩu bằng token thành công", null));
    }

    @PostMapping("/forgot-password")
    @Operation(summary = "Gửi yêu cầu quên mật khẩu đến admin")
    public ResponseEntity<ApiResponse<PasswordResetRequestResponse>> forgotPassword(@RequestBody ForgotPasswordRequest request) {
        return ResponseEntity.ok(ApiResponse.success("Đã gửi yêu cầu reset mật khẩu đến admin", authService.createPasswordResetRequest(request)));
    }

    @GetMapping("/confirm-email")
    @Operation(summary = "Xác nhận email bằng token")
    public ResponseEntity<ApiResponse<Void>> confirmEmail(@RequestParam String token) {
        authService.confirmEmail(token);
        return ResponseEntity.ok(ApiResponse.success("Xác nhận email thành công", null));
    }

    @GetMapping("/admin/password-reset-requests")
    @PreAuthorize("hasAnyRole('ADMIN','SUPER_ADMIN')")
    @Operation(summary = "Admin xem danh sách yêu cầu quên mật khẩu")
    public ResponseEntity<ApiResponse<List<PasswordResetRequestResponse>>> getPasswordResetRequests(
            @RequestParam(required = false) String status) {
        return ResponseEntity.ok(ApiResponse.success("Lấy danh sách yêu cầu reset mật khẩu thành công", authService.getPasswordResetRequests(status)));
    }

    @PutMapping("/admin/password-reset-requests/{id}/approve")
    @PreAuthorize("hasAnyRole('ADMIN','SUPER_ADMIN')")
    @Operation(summary = "Admin duyệt yêu cầu và reset mật khẩu về ngày sinh")
    public ResponseEntity<ApiResponse<AdminResetPasswordResponse>> approvePasswordResetRequest(
            @PathVariable UUID id,
            @RequestBody(required = false) ResetPasswordRequest request) {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        return ResponseEntity.ok(ApiResponse.success("Reset mật khẩu thành công", authService.approvePasswordResetRequest(id, request, auth.getName())));
    }

    @PutMapping("/admin/password-reset-requests/{id}/reject")
    @PreAuthorize("hasAnyRole('ADMIN','SUPER_ADMIN')")
    @Operation(summary = "Admin từ chối yêu cầu reset mật khẩu")
    public ResponseEntity<ApiResponse<Void>> rejectPasswordResetRequest(
            @PathVariable UUID id,
            @RequestBody(required = false) ResetPasswordRequest request) {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        authService.rejectPasswordResetRequest(id, request, auth.getName());
        return ResponseEntity.ok(ApiResponse.success("Từ chối yêu cầu reset mật khẩu thành công", null));
    }

    @PostMapping("/logout")
    @Operation(summary = "Đăng xuất khỏi hệ thống")
    public ResponseEntity<ApiResponse<Void>> logout() {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        if (auth != null && auth.isAuthenticated() && !"anonymousUser".equals(auth.getName())) {
            authService.logout(auth.getName());
        }
        return ResponseEntity.ok(ApiResponse.success("Đăng xuất thành công", null));
    }

    @PostMapping("/logout-all")
    @Operation(summary = "Đăng xuất tất cả thiết bị")
    public ResponseEntity<ApiResponse<Void>> logoutAll() {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        if (auth != null && auth.isAuthenticated() && !"anonymousUser".equals(auth.getName())) {
            authService.logout(auth.getName());
        }
        return ResponseEntity.ok(ApiResponse.success("Đăng xuất tất cả thiết bị thành công", null));
    }

    @PostMapping("/refresh")
    @Operation(summary = "Làm mới token")
    public ResponseEntity<ApiResponse<String>> refresh(@Valid @RequestBody RefreshTokenRequest request) {
        return ResponseEntity.ok(ApiResponse.success("Làm mới token thành công", "new-jwt-token-string"));
    }
}

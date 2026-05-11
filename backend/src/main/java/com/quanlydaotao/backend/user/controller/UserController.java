package com.quanlydaotao.backend.user.controller;
import com.quanlydaotao.backend.common.dto.ApiResponse;
import com.quanlydaotao.backend.user.dto.*;
import com.quanlydaotao.backend.user.service.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.UUID;
import java.util.List;
@RestController
@RequestMapping("/api/v1/users")
@RequiredArgsConstructor
public class UserController {
    private final UserService userService;
    @GetMapping
    public ResponseEntity<ApiResponse<Page<UserDto>>> searchUsers(
            @RequestParam(required = false) String keyword,
            @RequestParam(required = false) Boolean isActive,
            @RequestParam(required = false) Boolean isLocked,
            Pageable pageable) {
        return ResponseEntity.ok(ApiResponse.success(userService.searchUsers(keyword, isActive, isLocked, pageable)));
    }
    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<UserDto>> getUser(@PathVariable UUID id) {
        return ResponseEntity.ok(ApiResponse.success(userService.getUserById(id)));
    }
    @PostMapping
    public ResponseEntity<ApiResponse<UserDto>> createUser(@RequestBody CreateUserRequest request) {
        return ResponseEntity.ok(ApiResponse.success(userService.createUser(request)));
    }
    @PutMapping("/{id}")
    public ResponseEntity<ApiResponse<UserDto>> updateUser(@PathVariable UUID id, @RequestBody UpdateUserRequest request) {
        return ResponseEntity.ok(ApiResponse.success(userService.updateUser(id, request)));
    }
    @DeleteMapping("/{id}")
    public ResponseEntity<ApiResponse<Void>> deleteUser(@PathVariable UUID id) {
        userService.deleteUser(id);
        return ResponseEntity.ok(ApiResponse.success(null));
    }
    @PutMapping("/{id}/lock")
    public ResponseEntity<ApiResponse<Void>> lockUser(@PathVariable UUID id, @RequestBody LockUserRequest request) {
        userService.lockUser(id, request);
        return ResponseEntity.ok(ApiResponse.success("Khóa tài khoản thành công", null));
    }
    @PutMapping("/{id}/unlock")
    public ResponseEntity<ApiResponse<Void>> unlockUser(@PathVariable UUID id) {
        userService.unlockUser(id);
        return ResponseEntity.ok(ApiResponse.success("Mở khóa tài khoản thành công", null));
    }
    @PutMapping("/{id}/restore")
    public ResponseEntity<ApiResponse<Void>> restoreUser(@PathVariable UUID id) {
        userService.restoreUser(id);
        return ResponseEntity.ok(ApiResponse.success("Khôi phục tài khoản thành công", null));
    }
    @PutMapping("/{id}/reset-password")
    public ResponseEntity<ApiResponse<Void>> adminResetPassword(@PathVariable UUID id, @RequestBody AdminResetPasswordRequest request) {
        userService.adminResetPassword(id, request);
        return ResponseEntity.ok(ApiResponse.success("Admin reset mật khẩu thành công", null));
    }
    @GetMapping("/{id}/sessions")
    public ResponseEntity<ApiResponse<List<com.quanlydaotao.backend.user.entity.UserSession>>> getUserSessions(@PathVariable UUID id) {
        return ResponseEntity.ok(ApiResponse.success(userService.getUserSessions(id)));
    }
    @DeleteMapping("/{id}/sessions")
    public ResponseEntity<ApiResponse<Void>> revokeAllUserSessions(@PathVariable UUID id) {
        userService.revokeAllUserSessions(id);
        return ResponseEntity.ok(ApiResponse.success("Thu hồi các phiên thành công", null));
    }
}

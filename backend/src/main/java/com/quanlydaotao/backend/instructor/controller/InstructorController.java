package com.quanlydaotao.backend.instructor.controller;

import com.quanlydaotao.backend.account.dto.AccountCreationResponse;
import com.quanlydaotao.backend.common.dto.ApiResponse;
import com.quanlydaotao.backend.instructor.dto.InstructorAdminCreateRequest;
import com.quanlydaotao.backend.instructor.dto.InstructorAdminResponse;
import com.quanlydaotao.backend.instructor.dto.InstructorAdminUpdateRequest;
import com.quanlydaotao.backend.instructor.dto.InstructorSelfResponse;
import com.quanlydaotao.backend.instructor.dto.InstructorSelfUpdateRequest;
import com.quanlydaotao.backend.instructor.service.InstructorService;
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
@RequestMapping("/api/v1/instructors")
@RequiredArgsConstructor
@Tag(name = "Quản lý giảng viên", description = "API quản trị và tự quản lý thông tin giảng viên")
public class InstructorController {
    private final InstructorService instructorService;

    @PostMapping("/admin")
    @PreAuthorize("hasAnyRole('ADMIN','SUPER_ADMIN')")
    @Operation(summary = "Admin tạo giảng viên và tài khoản đăng nhập")
    public ResponseEntity<ApiResponse<AccountCreationResponse>> createInstructorForAdmin(
            @Valid @RequestBody InstructorAdminCreateRequest request) {
        return ResponseEntity.ok(ApiResponse.success("Tạo giảng viên và tài khoản thành công", instructorService.createInstructorForAdmin(request)));
    }

    @GetMapping("/admin")
    @PreAuthorize("hasAnyRole('ADMIN','SUPER_ADMIN')")
    @Operation(summary = "Admin lấy danh sách giảng viên")
    public ResponseEntity<ApiResponse<List<InstructorAdminResponse>>> getAllInstructorsForAdmin() {
        return ResponseEntity.ok(ApiResponse.success("Lấy danh sách giảng viên thành công", instructorService.getAllInstructorsForAdmin()));
    }

    @GetMapping("/admin/{id}")
    @PreAuthorize("hasAnyRole('ADMIN','SUPER_ADMIN')")
    @Operation(summary = "Admin lấy chi tiết giảng viên")
    public ResponseEntity<ApiResponse<InstructorAdminResponse>> getInstructorForAdmin(@PathVariable UUID id) {
        return ResponseEntity.ok(ApiResponse.success("Lấy thông tin giảng viên thành công", instructorService.getInstructorForAdmin(id)));
    }

    @PutMapping("/admin/{id}")
    @PreAuthorize("hasAnyRole('ADMIN','SUPER_ADMIN')")
    @Operation(summary = "Admin cập nhật toàn bộ thông tin giảng viên")
    public ResponseEntity<ApiResponse<InstructorAdminResponse>> updateInstructorForAdmin(
            @PathVariable UUID id,
            @RequestBody InstructorAdminUpdateRequest request) {
        return ResponseEntity.ok(ApiResponse.success("Cập nhật giảng viên thành công", instructorService.updateInstructorForAdmin(id, request)));
    }

    @DeleteMapping("/admin/{id}")
    @PreAuthorize("hasAnyRole('ADMIN','SUPER_ADMIN')")
    @Operation(summary = "Admin xóa mềm giảng viên")
    public ResponseEntity<ApiResponse<Void>> deleteInstructorForAdmin(@PathVariable UUID id) {
        instructorService.deleteInstructorForAdmin(id);
        return ResponseEntity.ok(ApiResponse.success("Xóa giảng viên thành công", null));
    }

    @GetMapping("/me")
    @PreAuthorize("hasRole('LECTURER')")
    @Operation(summary = "Giảng viên xem thông tin của chính mình")
    public ResponseEntity<ApiResponse<InstructorSelfResponse>> getCurrentInstructor(Authentication authentication) {
        return ResponseEntity.ok(ApiResponse.success("Lấy thông tin giảng viên thành công", instructorService.getCurrentInstructor(authentication.getName())));
    }

    @PutMapping("/me")
    @PreAuthorize("hasRole('LECTURER')")
    @Operation(summary = "Giảng viên cập nhật thông tin cá nhân trong bảng Persons")
    public ResponseEntity<ApiResponse<InstructorSelfResponse>> updateCurrentInstructor(
            Authentication authentication,
            @RequestBody InstructorSelfUpdateRequest request) {
        return ResponseEntity.ok(ApiResponse.success("Cập nhật thông tin cá nhân thành công", instructorService.updateCurrentInstructor(authentication.getName(), request)));
    }
}

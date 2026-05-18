package com.quanlydaotao.backend.student.controller;

import com.quanlydaotao.backend.account.dto.AccountCreationResponse;
import com.quanlydaotao.backend.common.dto.ApiResponse;
import com.quanlydaotao.backend.student.dto.StudentAdminCreateRequest;
import com.quanlydaotao.backend.student.dto.StudentAdminResponse;
import com.quanlydaotao.backend.student.dto.StudentAdminUpdateRequest;
import com.quanlydaotao.backend.student.dto.StudentSelfResponse;
import com.quanlydaotao.backend.student.dto.StudentSelfUpdateRequest;
import com.quanlydaotao.backend.student.service.StudentService;
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
@RequestMapping("/api/v1/students")
@RequiredArgsConstructor
@Tag(name = "Quản lý sinh viên", description = "API quản trị và tự quản lý thông tin sinh viên")
public class StudentController {
    private final StudentService studentService;

    @PostMapping("/admin")
    @PreAuthorize("hasAnyRole('ADMIN','SUPER_ADMIN')")
    @Operation(summary = "Admin tạo sinh viên và tài khoản đăng nhập")
    public ResponseEntity<ApiResponse<AccountCreationResponse>> createStudentForAdmin(
            @Valid @RequestBody StudentAdminCreateRequest request) {
        return ResponseEntity.ok(ApiResponse.success("Tạo sinh viên và tài khoản thành công", studentService.createStudentForAdmin(request)));
    }

    @GetMapping("/admin")
    @PreAuthorize("hasAnyRole('ADMIN','SUPER_ADMIN')")
    @Operation(summary = "Admin lấy danh sách sinh viên")
    public ResponseEntity<ApiResponse<List<StudentAdminResponse>>> getAllStudentsForAdmin() {
        return ResponseEntity.ok(ApiResponse.success("Lấy danh sách sinh viên thành công", studentService.getAllStudentsForAdmin()));
    }

    @GetMapping("/admin/{id}")
    @PreAuthorize("hasAnyRole('ADMIN','SUPER_ADMIN')")
    @Operation(summary = "Admin lấy chi tiết sinh viên")
    public ResponseEntity<ApiResponse<StudentAdminResponse>> getStudentForAdmin(@PathVariable UUID id) {
        return ResponseEntity.ok(ApiResponse.success("Lấy thông tin sinh viên thành công", studentService.getStudentForAdmin(id)));
    }

    @PutMapping("/admin/{id}")
    @PreAuthorize("hasAnyRole('ADMIN','SUPER_ADMIN')")
    @Operation(summary = "Admin cập nhật toàn bộ thông tin sinh viên")
    public ResponseEntity<ApiResponse<StudentAdminResponse>> updateStudentForAdmin(
            @PathVariable UUID id,
            @RequestBody StudentAdminUpdateRequest request) {
        return ResponseEntity.ok(ApiResponse.success("Cập nhật sinh viên thành công", studentService.updateStudentForAdmin(id, request)));
    }

    @DeleteMapping("/admin/{id}")
    @PreAuthorize("hasAnyRole('ADMIN','SUPER_ADMIN')")
    @Operation(summary = "Admin xóa mềm sinh viên")
    public ResponseEntity<ApiResponse<Void>> deleteStudentForAdmin(@PathVariable UUID id) {
        studentService.deleteStudentForAdmin(id);
        return ResponseEntity.ok(ApiResponse.success("Xóa sinh viên thành công", null));
    }

    @GetMapping("/me")
    @PreAuthorize("hasRole('STUDENT')")
    @Operation(summary = "Sinh viên xem thông tin của chính mình")
    public ResponseEntity<ApiResponse<StudentSelfResponse>> getCurrentStudent(Authentication authentication) {
        return ResponseEntity.ok(ApiResponse.success("Lấy thông tin sinh viên thành công", studentService.getCurrentStudent(authentication.getName())));
    }

    @PutMapping("/me")
    @PreAuthorize("hasRole('STUDENT')")
    @Operation(summary = "Sinh viên cập nhật thông tin cá nhân trong bảng Persons")
    public ResponseEntity<ApiResponse<StudentSelfResponse>> updateCurrentStudent(
            Authentication authentication,
            @RequestBody StudentSelfUpdateRequest request) {
        return ResponseEntity.ok(ApiResponse.success("Cập nhật thông tin cá nhân thành công", studentService.updateCurrentStudent(authentication.getName(), request)));
    }
}

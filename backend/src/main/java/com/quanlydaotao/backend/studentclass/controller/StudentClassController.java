package com.quanlydaotao.backend.studentclass.controller;

import com.quanlydaotao.backend.common.dto.ApiResponse;
import com.quanlydaotao.backend.studentclass.dto.StudentClassRequest;
import com.quanlydaotao.backend.studentclass.dto.StudentClassResponse;
import com.quanlydaotao.backend.studentclass.service.StudentClassService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.DeleteMapping;
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
@RequestMapping("/api/v1/student-classes")
@RequiredArgsConstructor
@Tag(name = "Quản lý lớp hành chính của sinh viên", description = "API admin quản lý quan hệ sinh viên và lớp hành chính theo học kỳ")
public class StudentClassController {
    private final StudentClassService studentClassService;

    @GetMapping("/admin")
    @PreAuthorize("hasAnyRole('ADMIN','SUPER_ADMIN') or @rbacPermissionEvaluator.hasCurrentRequestPermission(authentication)")
    @Operation(summary = "Admin lấy danh sách lớp hành chính của sinh viên")
    public ResponseEntity<ApiResponse<List<StudentClassResponse>>> search(
            @RequestParam(required = false) UUID studentId,
            @RequestParam(required = false) UUID classId,
            @RequestParam(required = false) UUID semesterId,
            @RequestParam(required = false) Boolean isActive) {
        return ResponseEntity.ok(ApiResponse.success("Lấy danh sách lớp hành chính của sinh viên thành công",
                studentClassService.search(studentId, classId, semesterId, isActive)));
    }

    @GetMapping("/admin/{id}")
    @PreAuthorize("hasAnyRole('ADMIN','SUPER_ADMIN') or @rbacPermissionEvaluator.hasCurrentRequestPermission(authentication)")
    @Operation(summary = "Admin lấy chi tiết lớp hành chính của sinh viên")
    public ResponseEntity<ApiResponse<StudentClassResponse>> get(@PathVariable UUID id) {
        return ResponseEntity.ok(ApiResponse.success("Lấy lớp hành chính của sinh viên thành công", studentClassService.getStudentClass(id)));
    }

    @PostMapping("/admin")
    @PreAuthorize("hasAnyRole('ADMIN','SUPER_ADMIN') or @rbacPermissionEvaluator.hasCurrentRequestPermission(authentication)")
    @Operation(summary = "Admin gán sinh viên vào lớp hành chính theo học kỳ")
    public ResponseEntity<ApiResponse<StudentClassResponse>> create(@Valid @RequestBody StudentClassRequest request) {
        return ResponseEntity.ok(ApiResponse.success("Gán sinh viên vào lớp hành chính thành công", studentClassService.createStudentClass(request)));
    }

    @PutMapping("/admin/{id}")
    @PreAuthorize("hasAnyRole('ADMIN','SUPER_ADMIN') or @rbacPermissionEvaluator.hasCurrentRequestPermission(authentication)")
    @Operation(summary = "Admin cập nhật lớp hành chính của sinh viên")
    public ResponseEntity<ApiResponse<StudentClassResponse>> update(@PathVariable UUID id,
                                                                    @RequestBody StudentClassRequest request) {
        return ResponseEntity.ok(ApiResponse.success("Cập nhật lớp hành chính của sinh viên thành công",
                studentClassService.updateStudentClass(id, request)));
    }

    @DeleteMapping("/admin/{id}")
    @PreAuthorize("hasAnyRole('ADMIN','SUPER_ADMIN') or @rbacPermissionEvaluator.hasCurrentRequestPermission(authentication)")
    @Operation(summary = "Admin xóa mềm lớp hành chính của sinh viên")
    public ResponseEntity<ApiResponse<Void>> delete(@PathVariable UUID id) {
        studentClassService.deleteStudentClass(id);
        return ResponseEntity.ok(ApiResponse.success("Xóa lớp hành chính của sinh viên thành công", null));
    }
}

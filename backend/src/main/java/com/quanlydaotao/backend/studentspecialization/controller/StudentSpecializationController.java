package com.quanlydaotao.backend.studentspecialization.controller;

import com.quanlydaotao.backend.common.dto.ApiResponse;
import com.quanlydaotao.backend.studentspecialization.dto.StudentSpecializationAssignRequest;
import com.quanlydaotao.backend.studentspecialization.dto.StudentSpecializationHistoryResponse;
import com.quanlydaotao.backend.studentspecialization.service.StudentSpecializationService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/v1/student-specializations")
@RequiredArgsConstructor
@Tag(name = "Quản lý phân chuyên ngành sinh viên", description = "API admin gán chuyên ngành và chương trình đào tạo chuyên ngành cho sinh viên")
public class StudentSpecializationController {
    private final StudentSpecializationService studentSpecializationService;

    @GetMapping("/admin")
    @PreAuthorize("hasAnyRole('ADMIN','SUPER_ADMIN')")
    @Operation(summary = "Admin lấy lịch sử phân chuyên ngành sinh viên")
    public ResponseEntity<ApiResponse<List<StudentSpecializationHistoryResponse>>> search(
            @RequestParam(required = false) UUID studentId,
            @RequestParam(required = false) UUID majorId,
            @RequestParam(required = false) UUID specializationId,
            @RequestParam(required = false) Boolean isCurrent,
            @RequestParam(required = false) Boolean isActive) {
        return ResponseEntity.ok(ApiResponse.success("Lấy lịch sử phân chuyên ngành thành công",
                studentSpecializationService.search(studentId, majorId, specializationId, isCurrent, isActive)));
    }

    @PostMapping("/admin/assign")
    @PreAuthorize("hasAnyRole('ADMIN','SUPER_ADMIN')")
    @Operation(summary = "Admin gán chuyên ngành cho sinh viên")
    public ResponseEntity<ApiResponse<StudentSpecializationHistoryResponse>> assign(@Valid @RequestBody StudentSpecializationAssignRequest request) {
        return ResponseEntity.ok(ApiResponse.success("Gán chuyên ngành cho sinh viên thành công",
                studentSpecializationService.assignSpecialization(request)));
    }
}

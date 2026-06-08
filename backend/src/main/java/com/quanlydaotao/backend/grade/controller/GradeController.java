package com.quanlydaotao.backend.grade.controller;

import com.quanlydaotao.backend.common.dto.ApiResponse;
import com.quanlydaotao.backend.grade.dto.GradeComponentRequest;
import com.quanlydaotao.backend.grade.dto.GradeComponentResponse;
import com.quanlydaotao.backend.grade.dto.StudentComponentGradeRequest;
import com.quanlydaotao.backend.grade.dto.StudentComponentGradeResponse;
import com.quanlydaotao.backend.grade.dto.StudentSummaryResponse;
import com.quanlydaotao.backend.grade.service.GradeService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
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
@RequestMapping("/api/v1/admin/grades")
@RequiredArgsConstructor
@PreAuthorize("hasAnyRole('ADMIN','SUPER_ADMIN') or @rbacPermissionEvaluator.hasCurrentRequestPermission(authentication)")
@Tag(name = "Quản lý điểm học phần", description = "API cấu hình cột điểm, nhập điểm thành phần và chốt kết quả học phần")
public class GradeController {
    private final GradeService gradeService;

    @GetMapping("/components")
    @Operation(summary = "Admin lấy danh sách cột điểm của học phần")
    public ResponseEntity<ApiResponse<List<GradeComponentResponse>>> getComponents(@RequestParam UUID courseId) {
        return ResponseEntity.ok(ApiResponse.success("Lấy danh sách cột điểm thành công", gradeService.getComponents(courseId)));
    }

    @PostMapping("/components")
    @Operation(summary = "Admin tạo cột điểm cho học phần")
    public ResponseEntity<ApiResponse<GradeComponentResponse>> createComponent(@Valid @RequestBody GradeComponentRequest request) {
        return ResponseEntity.ok(ApiResponse.success("Tạo cột điểm thành công", gradeService.createComponent(request)));
    }

    @PutMapping("/components/{componentId}")
    @Operation(summary = "Admin cập nhật cột điểm của học phần")
    public ResponseEntity<ApiResponse<GradeComponentResponse>> updateComponent(
            @PathVariable UUID componentId,
            @Valid @RequestBody GradeComponentRequest request) {
        return ResponseEntity.ok(ApiResponse.success("Cập nhật cột điểm thành công", gradeService.updateComponent(componentId, request)));
    }

    @GetMapping("/registrations/{courseRegistrationId}/component-scores")
    @Operation(summary = "Admin xem điểm thành phần của một lần học")
    public ResponseEntity<ApiResponse<List<StudentComponentGradeResponse>>> getComponentScores(@PathVariable UUID courseRegistrationId) {
        return ResponseEntity.ok(ApiResponse.success("Lấy điểm thành phần thành công", gradeService.getComponentScores(courseRegistrationId)));
    }

    @PostMapping("/registrations/{courseRegistrationId}/component-scores")
    @Operation(summary = "Admin nhập hoặc cập nhật điểm thành phần của một lần học")
    public ResponseEntity<ApiResponse<StudentComponentGradeResponse>> upsertComponentScore(
            @PathVariable UUID courseRegistrationId,
            @Valid @RequestBody StudentComponentGradeRequest request) {
        return ResponseEntity.ok(ApiResponse.success("Lưu điểm thành phần thành công",
                gradeService.upsertComponentScore(courseRegistrationId, request)));
    }

    @PostMapping("/registrations/{courseRegistrationId}/finalize")
    @Operation(summary = "Admin chốt điểm tổng kết của một lần học")
    public ResponseEntity<ApiResponse<StudentSummaryResponse>> finalizeSummary(@PathVariable UUID courseRegistrationId) {
        return ResponseEntity.ok(ApiResponse.success("Chốt điểm tổng kết thành công", gradeService.finalizeSummary(courseRegistrationId)));
    }

    @GetMapping("/registrations/{courseRegistrationId}/summary")
    @Operation(summary = "Admin xem điểm tổng kết của một lần học")
    public ResponseEntity<ApiResponse<StudentSummaryResponse>> getSummary(@PathVariable UUID courseRegistrationId) {
        return ResponseEntity.ok(ApiResponse.success("Lấy điểm tổng kết thành công", gradeService.getSummary(courseRegistrationId)));
    }

    @GetMapping("/students/{studentId}/summaries")
    @Operation(summary = "Admin xem toàn bộ kết quả học phần đã chốt của sinh viên")
    public ResponseEntity<ApiResponse<List<StudentSummaryResponse>>> getStudentSummaries(@PathVariable UUID studentId) {
        return ResponseEntity.ok(ApiResponse.success("Lấy kết quả học phần của sinh viên thành công",
                gradeService.getStudentSummaries(studentId)));
    }
}

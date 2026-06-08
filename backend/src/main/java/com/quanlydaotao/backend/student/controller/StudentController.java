package com.quanlydaotao.backend.student.controller;

import com.quanlydaotao.backend.account.dto.AccountCreationResponse;
import com.quanlydaotao.backend.common.dto.ApiResponse;
import com.quanlydaotao.backend.student.dto.StudentAdminCreateRequest;
import com.quanlydaotao.backend.student.dto.StudentAdminResponse;
import com.quanlydaotao.backend.student.dto.StudentAdminUpdateRequest;
import com.quanlydaotao.backend.student.dto.StudentImportResponse;
import com.quanlydaotao.backend.student.dto.StudentPortalAnnouncementResponse;
import com.quanlydaotao.backend.student.dto.StudentPortalAcademicResultResponse;
import com.quanlydaotao.backend.student.dto.StudentPortalDocumentResponse;
import com.quanlydaotao.backend.student.dto.StudentPortalExamResponse;
import com.quanlydaotao.backend.student.dto.StudentPortalRegistrationResponse;
import com.quanlydaotao.backend.student.dto.StudentPortalScheduleResponse;
import com.quanlydaotao.backend.student.dto.StudentSelfResponse;
import com.quanlydaotao.backend.student.dto.StudentSelfUpdateRequest;
import com.quanlydaotao.backend.student.dto.StudentPortalSupportRequest;
import com.quanlydaotao.backend.student.dto.StudentPortalSupportRequestResponse;
import com.quanlydaotao.backend.student.dto.StudentPortalTuitionResponse;
import com.quanlydaotao.backend.student.service.StudentImportService;
import com.quanlydaotao.backend.student.service.StudentService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.MediaType;
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
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/v1/students")
@RequiredArgsConstructor
@Tag(name = "Quản lý sinh viên", description = "API quản trị và tự quản lý thông tin sinh viên")
public class StudentController {
    private final StudentService studentService;
    private final StudentImportService studentImportService;

    @PostMapping("/admin")
    @PreAuthorize("hasAnyRole('ADMIN','SUPER_ADMIN') or @rbacPermissionEvaluator.hasCurrentRequestPermission(authentication)")
    @Operation(summary = "Admin tạo sinh viên và tài khoản đăng nhập")
    public ResponseEntity<ApiResponse<AccountCreationResponse>> createStudentForAdmin(
            @Valid @RequestBody StudentAdminCreateRequest request) {
        return ResponseEntity.ok(ApiResponse.success("Tạo sinh viên và tài khoản thành công", studentService.createStudentForAdmin(request)));
    }

    @PostMapping(value = "/admin/import-excel", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    @PreAuthorize("hasAnyRole('ADMIN','SUPER_ADMIN') or @rbacPermissionEvaluator.hasCurrentRequestPermission(authentication)")
    @Operation(summary = "Admin import danh sÃ¡ch sinh viÃªn báº±ng file Excel")
    public ResponseEntity<ApiResponse<StudentImportResponse>> importStudentsFromExcel(
            @RequestParam("file") MultipartFile file) {
        return ResponseEntity.ok(ApiResponse.success("Import sinh viÃªn báº±ng Excel hoÃ n táº¥t",
                studentImportService.importStudentsFromExcel(file)));
    }

    @GetMapping("/admin")
    @PreAuthorize("hasAnyRole('ADMIN','SUPER_ADMIN') or @rbacPermissionEvaluator.hasCurrentRequestPermission(authentication)")
    @Operation(summary = "Admin lấy danh sách sinh viên")
    public ResponseEntity<ApiResponse<List<StudentAdminResponse>>> getAllStudentsForAdmin() {
        return ResponseEntity.ok(ApiResponse.success("Lấy danh sách sinh viên thành công", studentService.getAllStudentsForAdmin()));
    }

    @GetMapping("/admin/{id}")
    @PreAuthorize("hasAnyRole('ADMIN','SUPER_ADMIN') or @rbacPermissionEvaluator.hasCurrentRequestPermission(authentication)")
    @Operation(summary = "Admin lấy chi tiết sinh viên")
    public ResponseEntity<ApiResponse<StudentAdminResponse>> getStudentForAdmin(@PathVariable UUID id) {
        return ResponseEntity.ok(ApiResponse.success("Lấy thông tin sinh viên thành công", studentService.getStudentForAdmin(id)));
    }

    @PutMapping("/admin/{id}")
    @PreAuthorize("hasAnyRole('ADMIN','SUPER_ADMIN') or @rbacPermissionEvaluator.hasCurrentRequestPermission(authentication)")
    @Operation(summary = "Admin cập nhật toàn bộ thông tin sinh viên")
    public ResponseEntity<ApiResponse<StudentAdminResponse>> updateStudentForAdmin(
            @PathVariable UUID id,
            @RequestBody StudentAdminUpdateRequest request) {
        return ResponseEntity.ok(ApiResponse.success("Cập nhật sinh viên thành công", studentService.updateStudentForAdmin(id, request)));
    }

    @DeleteMapping("/admin/{id}")
    @PreAuthorize("hasAnyRole('ADMIN','SUPER_ADMIN') or @rbacPermissionEvaluator.hasCurrentRequestPermission(authentication)")
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

    @GetMapping("/me/schedule")
    @PreAuthorize("hasRole('STUDENT')")
    @Operation(summary = "Sinh viên xem thời khóa biểu của chính mình")
    public ResponseEntity<ApiResponse<List<StudentPortalScheduleResponse>>> getCurrentStudentSchedule(Authentication authentication) {
        return ResponseEntity.ok(ApiResponse.success("Lấy thời khóa biểu sinh viên thành công", studentService.getCurrentStudentSchedule(authentication.getName())));
    }

    @GetMapping("/me/academic-results")
    @PreAuthorize("hasRole('STUDENT')")
    @Operation(summary = "Sinh viên xem kết quả học tập của chính mình")
    public ResponseEntity<ApiResponse<StudentPortalAcademicResultResponse>> getCurrentStudentAcademicResult(Authentication authentication) {
        return ResponseEntity.ok(ApiResponse.success("Lấy kết quả học tập sinh viên thành công", studentService.getCurrentStudentAcademicResult(authentication.getName())));
    }

    @GetMapping("/me/announcements")
    @PreAuthorize("hasRole('STUDENT')")
    @Operation(summary = "Sinh viên xem thông báo của chính mình")
    public ResponseEntity<ApiResponse<List<StudentPortalAnnouncementResponse>>> getCurrentStudentAnnouncements(Authentication authentication) {
        return ResponseEntity.ok(ApiResponse.success("Lấy thông báo sinh viên thành công", studentService.getCurrentStudentAnnouncements(authentication.getName())));
    }

    @GetMapping("/me/documents")
    @PreAuthorize("hasRole('STUDENT')")
    @Operation(summary = "Sinh viên xem tài liệu học tập của chính mình")
    public ResponseEntity<ApiResponse<List<StudentPortalDocumentResponse>>> getCurrentStudentDocuments(Authentication authentication) {
        return ResponseEntity.ok(ApiResponse.success("Lấy tài liệu học tập sinh viên thành công", studentService.getCurrentStudentDocuments(authentication.getName())));
    }

    @GetMapping("/me/tuition")
    @PreAuthorize("hasRole('STUDENT')")
    @Operation(summary = "Sinh viên xem thông tin học phí của chính mình")
    public ResponseEntity<ApiResponse<StudentPortalTuitionResponse>> getCurrentStudentTuition(Authentication authentication) {
        return ResponseEntity.ok(ApiResponse.success("Lấy thông tin học phí sinh viên thành công", studentService.getCurrentStudentTuition(authentication.getName())));
    }

    @GetMapping("/me/registrations")
    @PreAuthorize("hasRole('STUDENT')")
    @Operation(summary = "Sinh viên xem học phần đã đăng ký")
    public ResponseEntity<ApiResponse<List<StudentPortalRegistrationResponse>>> getCurrentStudentRegistrations(Authentication authentication) {
        return ResponseEntity.ok(ApiResponse.success("Lấy đăng ký học phần sinh viên thành công", studentService.getCurrentStudentRegistrations(authentication.getName())));
    }

    @GetMapping("/me/exams")
    @PreAuthorize("hasRole('STUDENT')")
    @Operation(summary = "Sinh viên xem lịch thi của chính mình")
    public ResponseEntity<ApiResponse<List<StudentPortalExamResponse>>> getCurrentStudentExams(Authentication authentication) {
        return ResponseEntity.ok(ApiResponse.success("Lấy lịch thi sinh viên thành công", studentService.getCurrentStudentExams(authentication.getName())));
    }

    @GetMapping("/me/support-requests")
    @PreAuthorize("hasRole('STUDENT')")
    @Operation(summary = "Sinh viên xem yêu cầu hỗ trợ của chính mình")
    public ResponseEntity<ApiResponse<List<StudentPortalSupportRequestResponse>>> getCurrentStudentSupportRequests(Authentication authentication) {
        return ResponseEntity.ok(ApiResponse.success("Lấy yêu cầu hỗ trợ sinh viên thành công", studentService.getCurrentStudentSupportRequests(authentication.getName())));
    }

    @PostMapping("/me/support-requests")
    @PreAuthorize("hasRole('STUDENT')")
    @Operation(summary = "Sinh viên gửi yêu cầu hỗ trợ")
    public ResponseEntity<ApiResponse<StudentPortalSupportRequestResponse>> createCurrentStudentSupportRequest(
            Authentication authentication,
            @RequestBody StudentPortalSupportRequest request) {
        return ResponseEntity.ok(ApiResponse.success("Gửi yêu cầu hỗ trợ thành công", studentService.createCurrentStudentSupportRequest(authentication.getName(), request)));
    }
}

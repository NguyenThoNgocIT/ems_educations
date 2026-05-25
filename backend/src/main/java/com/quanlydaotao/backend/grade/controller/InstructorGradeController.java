package com.quanlydaotao.backend.grade.controller;

import com.quanlydaotao.backend.common.dto.ApiResponse;
import com.quanlydaotao.backend.grade.dto.GradeComponentResponse;
import com.quanlydaotao.backend.grade.dto.InstructorCourseClassStudentGradeResponse;
import com.quanlydaotao.backend.grade.dto.InstructorGradeCourseClassResponse;
import com.quanlydaotao.backend.grade.dto.StudentComponentGradeRequest;
import com.quanlydaotao.backend.grade.dto.StudentComponentGradeResponse;
import com.quanlydaotao.backend.grade.service.GradeService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/v1/instructors/grades")
@RequiredArgsConstructor
@PreAuthorize("hasRole('LECTURER')")
@Tag(name = "Giảng viên nhập điểm", description = "API để giảng viên xem lớp được phân công và nhập điểm thành phần")
public class InstructorGradeController {
    private final GradeService gradeService;

    @GetMapping("/course-classes")
    @Operation(summary = "Giảng viên lấy danh sách lớp học phần được phân công nhập điểm")
    public ResponseEntity<ApiResponse<List<InstructorGradeCourseClassResponse>>> getMyCourseClasses(
            Authentication authentication,
            @RequestParam(required = false) UUID semesterId) {
        return ResponseEntity.ok(ApiResponse.success("Lấy danh sách lớp học phần nhập điểm thành công",
                gradeService.getCurrentInstructorCourseClasses(authentication.getName(), semesterId)));
    }

    @GetMapping("/course-classes/{courseClassId}/components")
    @Operation(summary = "Giảng viên lấy cấu hình cột điểm của lớp học phần được phân công")
    public ResponseEntity<ApiResponse<List<GradeComponentResponse>>> getCourseClassComponents(
            Authentication authentication,
            @PathVariable UUID courseClassId) {
        return ResponseEntity.ok(ApiResponse.success("Lấy cấu hình cột điểm thành công",
                gradeService.getCurrentInstructorCourseClassComponents(authentication.getName(), courseClassId)));
    }

    @GetMapping("/course-classes/{courseClassId}/students")
    @Operation(summary = "Giảng viên lấy danh sách sinh viên và điểm của lớp học phần được phân công")
    public ResponseEntity<ApiResponse<List<InstructorCourseClassStudentGradeResponse>>> getCourseClassStudents(
            Authentication authentication,
            @PathVariable UUID courseClassId) {
        return ResponseEntity.ok(ApiResponse.success("Lấy danh sách sinh viên nhập điểm thành công",
                gradeService.getCurrentInstructorCourseClassStudents(authentication.getName(), courseClassId)));
    }

    @GetMapping("/registrations/{courseRegistrationId}/component-scores")
    @Operation(summary = "Giảng viên xem điểm thành phần của một sinh viên trong lớp được phân công")
    public ResponseEntity<ApiResponse<List<StudentComponentGradeResponse>>> getComponentScores(
            Authentication authentication,
            @PathVariable UUID courseRegistrationId) {
        return ResponseEntity.ok(ApiResponse.success("Lấy điểm thành phần thành công",
                gradeService.getCurrentInstructorComponentScores(authentication.getName(), courseRegistrationId)));
    }

    @PostMapping("/registrations/{courseRegistrationId}/component-scores")
    @Operation(summary = "Giảng viên nhập hoặc cập nhật điểm thành phần của một sinh viên trong lớp được phân công")
    public ResponseEntity<ApiResponse<StudentComponentGradeResponse>> upsertComponentScore(
            Authentication authentication,
            @PathVariable UUID courseRegistrationId,
            @Valid @RequestBody StudentComponentGradeRequest request) {
        return ResponseEntity.ok(ApiResponse.success("Lưu điểm thành phần thành công",
                gradeService.upsertCurrentInstructorComponentScore(authentication.getName(), courseRegistrationId, request)));
    }
}

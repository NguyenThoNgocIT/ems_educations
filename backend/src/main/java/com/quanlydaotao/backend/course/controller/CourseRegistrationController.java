package com.quanlydaotao.backend.course.controller;

import com.quanlydaotao.backend.common.dto.ApiResponse;
import com.quanlydaotao.backend.course.dto.CourseRegistrationResponse;
import com.quanlydaotao.backend.course.dto.RetakeImprovementOptionResponse;
import com.quanlydaotao.backend.course.dto.RetakeImprovementRegistrationRequest;
import com.quanlydaotao.backend.course.service.RegistrationService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/v1/students/me/retake-improvement-registrations")
@RequiredArgsConstructor
@PreAuthorize("hasRole('STUDENT')")
@Tag(name = "Đăng ký học lại và cải thiện", description = "API sinh viên đăng ký học lại hoặc học cải thiện dựa trên điểm tổng kết đã chốt")
public class CourseRegistrationController {
    private final RegistrationService registrationService;

    @GetMapping("/options")
    @Operation(summary = "Sinh viên xem danh sách lớp học phần đủ điều kiện học lại hoặc cải thiện")
    public ResponseEntity<ApiResponse<List<RetakeImprovementOptionResponse>>> getOptions(
            Authentication authentication,
            @RequestParam(required = false) UUID semesterId) {
        return ResponseEntity.ok(ApiResponse.success("Lấy danh sách lớp học lại/cải thiện thành công",
                registrationService.getCurrentStudentRetakeImprovementOptions(authentication.getName(), semesterId)));
    }

    @PostMapping
    @Operation(summary = "Sinh viên đăng ký học lại hoặc học cải thiện")
    public ResponseEntity<ApiResponse<CourseRegistrationResponse>> register(
            Authentication authentication,
            @Valid @RequestBody RetakeImprovementRegistrationRequest request) {
        return ResponseEntity.ok(ApiResponse.success("Đăng ký học lại/cải thiện thành công",
                registrationService.registerCurrentStudentRetakeImprovement(authentication.getName(), request)));
    }
}

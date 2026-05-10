package com.quanlydaotao.backend.registration.controller;

import com.quanlydaotao.backend.common.dto.ApiResponse;
import com.quanlydaotao.backend.registration.dto.request.CreateRegistrationRequest;
import com.quanlydaotao.backend.registration.dto.request.RegistrationSearchRequest;
import com.quanlydaotao.backend.registration.dto.request.UpdateRegistrationRequest;
import com.quanlydaotao.backend.registration.dto.response.RegistrationDetailResponse;
import com.quanlydaotao.backend.registration.dto.response.RegistrationResponse;
import com.quanlydaotao.backend.registration.service.RegistrationService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.data.web.PageableDefault;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.UUID;

@RestController
@RequestMapping("/api/v1/registrations")
@RequiredArgsConstructor
@Tag(name = "Registration Management", description = "APIs for managing course registrations")
public class RegistrationController {

    private final RegistrationService registrationService;

    @PostMapping
    @Operation(summary = "Create new registration")
    public ResponseEntity<ApiResponse<RegistrationResponse>> createRegistration(@Valid @RequestBody CreateRegistrationRequest request) {
        RegistrationResponse response = registrationService.createRegistration(request);
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.success("Đăng ký môn học thành công", response));
    }

    @GetMapping("/{id}")
    @Operation(summary = "Get registration by ID")
    public ResponseEntity<ApiResponse<RegistrationDetailResponse>> getRegistrationById(@PathVariable UUID id) {
        RegistrationDetailResponse response = registrationService.getRegistrationById(id);
        return ResponseEntity.ok(ApiResponse.success(response));
    }

    @GetMapping
    @Operation(summary = "Search registrations with pagination")
    public ResponseEntity<ApiResponse<Page<RegistrationResponse>>> searchRegistrations(
            @ModelAttribute RegistrationSearchRequest request,
            @PageableDefault(size = 10, sort = "registeredAt", direction = Sort.Direction.DESC) Pageable pageable) {
        Page<RegistrationResponse> response = registrationService.searchRegistrations(request, pageable);
        return ResponseEntity.ok(ApiResponse.success(response));
    }

    @GetMapping("/student/{studentId}")
    @Operation(summary = "Get registrations by student")
    public ResponseEntity<ApiResponse<Page<RegistrationResponse>>> getRegistrationsByStudent(
            @PathVariable UUID studentId,
            @PageableDefault(size = 10, sort = "registeredAt", direction = Sort.Direction.DESC) Pageable pageable) {
        Page<RegistrationResponse> response = registrationService.getRegistrationsByStudent(studentId, pageable);
        return ResponseEntity.ok(ApiResponse.success(response));
    }

    @PutMapping("/{id}")
    @Operation(summary = "Update registration")
    public ResponseEntity<ApiResponse<RegistrationResponse>> updateRegistration(
            @PathVariable UUID id,
            @Valid @RequestBody UpdateRegistrationRequest request) {
        RegistrationResponse response = registrationService.updateRegistration(id, request);
        return ResponseEntity.ok(ApiResponse.success("Cập nhật đăng ký thành công", response));
    }

    @PutMapping("/{id}/cancel")
    @Operation(summary = "Cancel registration")
    public ResponseEntity<ApiResponse<RegistrationResponse>> cancelRegistration(@PathVariable UUID id) {
        RegistrationResponse response = registrationService.cancelRegistration(id);
        return ResponseEntity.ok(ApiResponse.success("Hủy đăng ký thành công", response));
    }

    @PutMapping("/{id}/confirm")
    @Operation(summary = "Confirm registration (Admin)")
    public ResponseEntity<ApiResponse<RegistrationResponse>> confirmRegistration(@PathVariable UUID id) {
        RegistrationResponse response = registrationService.confirmRegistration(id);
        return ResponseEntity.ok(ApiResponse.success("Xác nhận đăng ký thành công", response));
    }

    @DeleteMapping("/{id}")
    @Operation(summary = "Delete registration (soft delete)")
    public ResponseEntity<ApiResponse<Void>> deleteRegistration(@PathVariable UUID id) {
        registrationService.deleteRegistration(id);
        return ResponseEntity.ok(ApiResponse.success("Xóa đăng ký thành công", null));
    }
}
package com.quanlydaotao.backend.person.controller;

import com.quanlydaotao.backend.common.dto.ApiResponse;
import com.quanlydaotao.backend.person.dto.PersonAdminResponse;
import com.quanlydaotao.backend.person.service.PersonService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.util.UUID;

@RestController
@RequestMapping("/api/v1/persons")
@RequiredArgsConstructor
@Tag(name = "Quản lý thông tin cá nhân", description = "API admin tra cứu dữ liệu nền Persons")
public class PersonController {
    private final PersonService personService;

    @GetMapping("/admin")
    @PreAuthorize("hasAnyRole('ADMIN','SUPER_ADMIN') or @rbacPermissionEvaluator.hasCurrentRequestPermission(authentication)")
    @Operation(summary = "Admin lấy danh sách thông tin cá nhân")
    public ResponseEntity<ApiResponse<Page<PersonAdminResponse>>> getPersonsForAdmin(
            @RequestParam(required = false) String keyword,
            Pageable pageable) {
        return ResponseEntity.ok(ApiResponse.success("Lấy danh sách thông tin cá nhân thành công", personService.getPersonsForAdmin(keyword, pageable)));
    }

    @GetMapping("/admin/{id}")
    @PreAuthorize("hasAnyRole('ADMIN','SUPER_ADMIN') or @rbacPermissionEvaluator.hasCurrentRequestPermission(authentication)")
    @Operation(summary = "Admin lấy chi tiết thông tin cá nhân")
    public ResponseEntity<ApiResponse<PersonAdminResponse>> getPersonForAdmin(@PathVariable UUID id) {
        return ResponseEntity.ok(ApiResponse.success("Lấy thông tin cá nhân thành công", personService.getPersonForAdmin(id)));
    }

}

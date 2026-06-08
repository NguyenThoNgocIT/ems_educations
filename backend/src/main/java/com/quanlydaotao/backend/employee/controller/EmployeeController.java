package com.quanlydaotao.backend.employee.controller;

import com.quanlydaotao.backend.common.dto.ApiResponse;
import com.quanlydaotao.backend.employee.dto.EmployeeAdminResponse;
import com.quanlydaotao.backend.employee.service.EmployeeService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/v1/employees")
@RequiredArgsConstructor
@Tag(name = "Quản lý nhân viên", description = "API admin tra cứu dữ liệu nền Employees")
public class EmployeeController {
    private final EmployeeService employeeService;

    @GetMapping("/admin")
    @PreAuthorize("hasAnyRole('ADMIN','SUPER_ADMIN') or @rbacPermissionEvaluator.hasCurrentRequestPermission(authentication)")
    @Operation(summary = "Admin lấy danh sách nhân viên")
    public ResponseEntity<ApiResponse<List<EmployeeAdminResponse>>> getAllEmployeesForAdmin() {
        return ResponseEntity.ok(ApiResponse.success("Lấy danh sách nhân viên thành công", employeeService.getAllEmployeesForAdmin()));
    }

    @GetMapping("/admin/{id}")
    @PreAuthorize("hasAnyRole('ADMIN','SUPER_ADMIN') or @rbacPermissionEvaluator.hasCurrentRequestPermission(authentication)")
    @Operation(summary = "Admin lấy chi tiết nhân viên")
    public ResponseEntity<ApiResponse<EmployeeAdminResponse>> getEmployeeForAdmin(@PathVariable UUID id) {
        return ResponseEntity.ok(ApiResponse.success("Lấy thông tin nhân viên thành công", employeeService.getEmployeeForAdmin(id)));
    }

}

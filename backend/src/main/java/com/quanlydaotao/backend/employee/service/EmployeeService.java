package com.quanlydaotao.backend.employee.service;

import com.quanlydaotao.backend.employee.dto.EmployeeAdminResponse;

import java.util.List;
import java.util.UUID;

public interface EmployeeService {
    List<EmployeeAdminResponse> getAllEmployeesForAdmin();
    EmployeeAdminResponse getEmployeeForAdmin(UUID id);
}

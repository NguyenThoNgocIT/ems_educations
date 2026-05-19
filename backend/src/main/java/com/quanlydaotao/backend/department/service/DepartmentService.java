package com.quanlydaotao.backend.department.service;

import com.quanlydaotao.backend.department.dto.DepartmentDto;

import java.util.List;
import java.util.UUID;

public interface DepartmentService {
    List<DepartmentDto> searchDepartments(String keyword, Boolean isActive);
    DepartmentDto getDepartment(UUID id);
    DepartmentDto createDepartment(DepartmentDto request);
    DepartmentDto updateDepartment(UUID id, DepartmentDto request);
    void deleteDepartment(UUID id);
}

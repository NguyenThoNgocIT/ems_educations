package com.quanlydaotao.backend.department.service;

import com.quanlydaotao.backend.department.dto.request.CreateDepartmentRequest;
import com.quanlydaotao.backend.department.dto.request.DepartmentSearchRequest;
import com.quanlydaotao.backend.department.dto.request.UpdateDepartmentRequest;
import com.quanlydaotao.backend.department.dto.response.DepartmentDetailResponse;
import com.quanlydaotao.backend.department.dto.response.DepartmentResponse;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

public interface DepartmentService {
    
    DepartmentResponse createDepartment(CreateDepartmentRequest request);
    
    DepartmentResponse updateDepartment(String departmentId, UpdateDepartmentRequest request);
    
    DepartmentDetailResponse getDepartmentById(String departmentId);
    
    Page<DepartmentResponse> searchDepartments(DepartmentSearchRequest request, Pageable pageable);
    
    void deleteDepartment(String departmentId);
}
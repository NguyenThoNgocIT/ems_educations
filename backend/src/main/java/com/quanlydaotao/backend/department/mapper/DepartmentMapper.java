package com.quanlydaotao.backend.department.mapper;

import com.quanlydaotao.backend.department.dto.request.CreateDepartmentRequest;
import com.quanlydaotao.backend.department.dto.request.UpdateDepartmentRequest;
import com.quanlydaotao.backend.department.dto.response.DepartmentDetailResponse;
import com.quanlydaotao.backend.department.dto.response.DepartmentResponse;
import com.quanlydaotao.backend.department.entity.Department;
import org.springframework.stereotype.Component;

import java.util.UUID;

@Component
public class DepartmentMapper {

    public Department toEntity(CreateDepartmentRequest request) {
        if (request == null) return null;
        
        return Department.builder()
                .code(request.getCode())
                .name(request.getName())
                .description(request.getDescription())
                .isActive(true)
                .build();
    }

    public void updateEntity(UpdateDepartmentRequest request, Department department) {
        if (request == null) return;
        if (request.getCode() != null) department.setCode(request.getCode());
        if (request.getName() != null) department.setName(request.getName());
        if (request.getDescription() != null) department.setDescription(request.getDescription());
        if (request.getIsActive() != null) department.setIsActive(request.getIsActive());
    }

    public DepartmentResponse toResponse(Department department) {
        if (department == null) return null;
        
        return DepartmentResponse.builder()
                .departmentId(department.getDepartmentId() != null ? department.getDepartmentId().toString() : null)
                .code(department.getCode())
                .name(department.getName())
                .description(department.getDescription())
                .isActive(department.getIsActive())
                .build();
    }

    public DepartmentDetailResponse toDetailResponse(Department department) {
        if (department == null) return null;
        
        return DepartmentDetailResponse.builder()
                .departmentId(department.getDepartmentId() != null ? department.getDepartmentId().toString() : null)
                .code(department.getCode())
                .name(department.getName())
                .description(department.getDescription())
                .isActive(department.getIsActive())
                .createdAt(department.getCreatedAt())
                .createdBy(department.getCreatedBy() != null ? department.getCreatedBy().toString() : null)
                .updatedAt(department.getUpdatedAt())
                .updatedBy(department.getUpdatedBy() != null ? department.getUpdatedBy().toString() : null)
                .build();
    }
}
package com.quanlydaotao.backend.major.mapper;

import com.quanlydaotao.backend.major.dto.request.CreateMajorRequest;
import com.quanlydaotao.backend.major.dto.request.UpdateMajorRequest;
import com.quanlydaotao.backend.major.dto.response.MajorDetailResponse;
import com.quanlydaotao.backend.major.dto.response.MajorResponse;
import com.quanlydaotao.backend.major.entity.Major;
import org.springframework.stereotype.Component;

@Component
public class MajorMapper {

    public Major toEntity(CreateMajorRequest request) {
        if (request == null) return null;
        
        return Major.builder()
                .code(request.getCode())
                .name(request.getName())
                .departmentId(request.getDepartmentId())
                .description(request.getDescription())
                .isActive(true)
                .build();
    }

    public void updateEntity(UpdateMajorRequest request, Major major) {
        if (request == null) return;
        if (request.getCode() != null) major.setCode(request.getCode());
        if (request.getName() != null) major.setName(request.getName());
        if (request.getDepartmentId() != null) major.setDepartmentId(request.getDepartmentId());
        if (request.getDescription() != null) major.setDescription(request.getDescription());
        if (request.getIsActive() != null) major.setIsActive(request.getIsActive());
    }

    public MajorResponse toResponse(Major major) {
        if (major == null) return null;
        
        return MajorResponse.builder()
                .majorId(major.getMajorId())
                .code(major.getCode())
                .name(major.getName())
                .departmentId(major.getDepartmentId())
                .description(major.getDescription())
                .isActive(major.getIsActive())
                .build();
    }

    public MajorDetailResponse toDetailResponse(Major major) {
        if (major == null) return null;
        
        return MajorDetailResponse.builder()
                .majorId(major.getMajorId())
                .code(major.getCode())
                .name(major.getName())
                .departmentId(major.getDepartmentId())
                .description(major.getDescription())
                .isActive(major.getIsActive())
                .createdAt(major.getCreatedAt())
                .createdBy(major.getCreatedBy() != null ? major.getCreatedBy().toString() : null)
                .updatedAt(major.getUpdatedAt())
                .updatedBy(major.getUpdatedBy() != null ? major.getUpdatedBy().toString() : null)
                .build();
    }
}
package com.quanlydaotao.backend.schoolyear.mapper;

import com.quanlydaotao.backend.schoolyear.dto.request.CreateSchoolYearRequest;
import com.quanlydaotao.backend.schoolyear.dto.request.UpdateSchoolYearRequest;
import com.quanlydaotao.backend.schoolyear.dto.response.SchoolYearDetailResponse;
import com.quanlydaotao.backend.schoolyear.dto.response.SchoolYearResponse;
import com.quanlydaotao.backend.schoolyear.entity.SchoolYear;
import org.springframework.stereotype.Component;

@Component
public class SchoolYearMapper {
    
    public SchoolYear toEntity(CreateSchoolYearRequest request) {
        if (request == null) return null;
        
        return SchoolYear.builder()
            .code(request.getCode())
            .name(request.getName())
            .startDate(request.getStartDate())
            .endDate(request.getEndDate())
            .description(request.getDescription())
            .isActive(true)
            .build();
    }
    
    public void updateEntity(UpdateSchoolYearRequest request, SchoolYear schoolYear) {
        if (request == null) return;
        
        if (request.getCode() != null) schoolYear.setCode(request.getCode());
        if (request.getName() != null) schoolYear.setName(request.getName());
        if (request.getStartDate() != null) schoolYear.setStartDate(request.getStartDate());
        if (request.getEndDate() != null) schoolYear.setEndDate(request.getEndDate());
        if (request.getDescription() != null) schoolYear.setDescription(request.getDescription());
        if (request.getIsActive() != null) schoolYear.setIsActive(request.getIsActive());
    }
    
    public SchoolYearResponse toResponse(SchoolYear schoolYear) {
        if (schoolYear == null) return null;
        
        return SchoolYearResponse.builder()
            .schoolYearId(schoolYear.getSchoolYearId())
            .code(schoolYear.getCode())
            .name(schoolYear.getName())
            .startDate(schoolYear.getStartDate())
            .endDate(schoolYear.getEndDate())
            .description(schoolYear.getDescription())
            .isActive(schoolYear.getIsActive())
            .build();
    }
    
    public SchoolYearDetailResponse toDetailResponse(SchoolYear schoolYear) {
        if (schoolYear == null) return null;
        
        SchoolYearDetailResponse.SchoolYearDetailResponseBuilder builder = SchoolYearDetailResponse.builder()
            .schoolYearId(schoolYear.getSchoolYearId())
            .code(schoolYear.getCode())
            .name(schoolYear.getName())
            .startDate(schoolYear.getStartDate())
            .endDate(schoolYear.getEndDate())
            .description(schoolYear.getDescription())
            .isActive(schoolYear.getIsActive())
            .createdAt(schoolYear.getCreatedAt())
            .updatedAt(schoolYear.getUpdatedAt());
        
        // Chỉ set nếu không null (tránh lỗi UUID -> String)
        if (schoolYear.getCreatedBy() != null) {
            builder.createdBy(schoolYear.getCreatedBy().toString());
        }
        if (schoolYear.getUpdatedBy() != null) {
            builder.updatedBy(schoolYear.getUpdatedBy().toString());
        }
        
        return builder.build();
    }
}
package com.quanlydaotao.backend.semester.mapper;

import com.quanlydaotao.backend.semester.dto.request.CreateSemesterRequest;
import com.quanlydaotao.backend.semester.dto.request.UpdateSemesterRequest;
import com.quanlydaotao.backend.semester.dto.response.SemesterDetailResponse;
import com.quanlydaotao.backend.semester.dto.response.SemesterResponse;
import com.quanlydaotao.backend.semester.entity.Semester;
import org.springframework.stereotype.Component;

@Component
public class SemesterMapper {
    
    public Semester toEntity(CreateSemesterRequest request) {
        if (request == null) return null;
        
        return Semester.builder()
            .code(request.getCode())
            .name(request.getName())
            .startDate(request.getStartDate())
            .endDate(request.getEndDate())
            .status(request.getStatus() != null ? request.getStatus() : 0)
            .description(request.getDescription())
            .isActive(true)
            .build();
    }
    
    public void updateEntity(UpdateSemesterRequest request, Semester semester) {
        if (request == null) return;
        
        if (request.getCode() != null) semester.setCode(request.getCode());
        if (request.getName() != null) semester.setName(request.getName());
        if (request.getStartDate() != null) semester.setStartDate(request.getStartDate());
        if (request.getEndDate() != null) semester.setEndDate(request.getEndDate());
        if (request.getStatus() != null) semester.setStatus(request.getStatus());
        if (request.getDescription() != null) semester.setDescription(request.getDescription());
        if (request.getIsActive() != null) semester.setIsActive(request.getIsActive());
    }
    
    public SemesterResponse toResponse(Semester semester) {
        if (semester == null) return null;
        
        String statusText = switch (semester.getStatus()) {
            case 0 -> "UPCOMING";
            case 1 -> "ONGOING";
            case 2 -> "ENDED";
            default -> "UNKNOWN";
        };
        
        return SemesterResponse.builder()
            .semesterId(semester.getSemesterId())
            .code(semester.getCode())
            .name(semester.getName())
            .schoolYearId(semester.getSchoolYear() != null ? semester.getSchoolYear().getSchoolYearId() : null)
            .schoolYearCode(semester.getSchoolYear() != null ? semester.getSchoolYear().getCode() : null)
            .schoolYearName(semester.getSchoolYear() != null ? semester.getSchoolYear().getName() : null)
            .startDate(semester.getStartDate())
            .endDate(semester.getEndDate())
            .status(semester.getStatus())
            .statusText(statusText)
            .description(semester.getDescription())
            .isActive(semester.getIsActive())
            .build();
    }
    
    public SemesterDetailResponse toDetailResponse(Semester semester) {
        if (semester == null) return null;
        
        SemesterDetailResponse.SemesterDetailResponseBuilder builder = SemesterDetailResponse.builder()
            .semesterId(semester.getSemesterId())
            .code(semester.getCode())
            .name(semester.getName())
            .schoolYearId(semester.getSchoolYear() != null ? semester.getSchoolYear().getSchoolYearId() : null)
            .schoolYearCode(semester.getSchoolYear() != null ? semester.getSchoolYear().getCode() : null)
            .schoolYearName(semester.getSchoolYear() != null ? semester.getSchoolYear().getName() : null)
            .startDate(semester.getStartDate())
            .endDate(semester.getEndDate())
            .status(semester.getStatus())
            .description(semester.getDescription())
            .isActive(semester.getIsActive())
            .createdAt(semester.getCreatedAt())
            .updatedAt(semester.getUpdatedAt());
        
        // Chỉ set nếu không null
        if (semester.getCreatedBy() != null) {
            builder.createdBy(semester.getCreatedBy().toString());
        }
        if (semester.getUpdatedBy() != null) {
            builder.updatedBy(semester.getUpdatedBy().toString());
        }
        
        // Set statusText
        switch (semester.getStatus()) {
            case 0 -> builder.statusText("UPCOMING");
            case 1 -> builder.statusText("ONGOING");
            case 2 -> builder.statusText("ENDED");
            default -> builder.statusText("UNKNOWN");
        }
        
        return builder.build();
    }
}
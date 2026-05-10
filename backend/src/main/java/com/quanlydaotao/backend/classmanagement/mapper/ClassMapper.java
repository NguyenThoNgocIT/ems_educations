package com.quanlydaotao.backend.classmanagement.mapper;

import com.quanlydaotao.backend.classmanagement.dto.request.CreateClassRequest;
import com.quanlydaotao.backend.classmanagement.dto.request.UpdateClassRequest;
import com.quanlydaotao.backend.classmanagement.dto.response.ClassDetailResponse;
import com.quanlydaotao.backend.classmanagement.dto.response.ClassResponse;
import com.quanlydaotao.backend.classmanagement.entity.Class;
import org.springframework.stereotype.Component;

@Component
public class ClassMapper {

    public Class toEntity(CreateClassRequest request) {
        if (request == null) return null;
        
        return Class.builder()
                .classCode(request.getClassCode())
                .className(request.getClassName())
                .departmentId(request.getDepartmentId())
                .advisorId(request.getAdvisorId())
                .academicCohortId(request.getAcademicCohortId())
                .maxSize(request.getMaxSize())
                .status(request.getStatus() != null ? request.getStatus() : 0)
                .note(request.getNote())
                .isActive(true)
                .build();
    }

    public void updateEntity(UpdateClassRequest request, Class classEntity) {
        if (request == null) return;
        if (request.getClassCode() != null) classEntity.setClassCode(request.getClassCode());
        if (request.getClassName() != null) classEntity.setClassName(request.getClassName());
        if (request.getDepartmentId() != null) classEntity.setDepartmentId(request.getDepartmentId());
        if (request.getAdvisorId() != null) classEntity.setAdvisorId(request.getAdvisorId());
        if (request.getAcademicCohortId() != null) classEntity.setAcademicCohortId(request.getAcademicCohortId());
        if (request.getMaxSize() != null) classEntity.setMaxSize(request.getMaxSize());
        if (request.getStatus() != null) classEntity.setStatus(request.getStatus());
        if (request.getNote() != null) classEntity.setNote(request.getNote());
        if (request.getIsActive() != null) classEntity.setIsActive(request.getIsActive());
    }

    public ClassResponse toResponse(Class classEntity) {
        if (classEntity == null) return null;
        
        String statusText = switch (classEntity.getStatus() != null ? classEntity.getStatus() : 0) {
            case 0 -> "PLANNING";
            case 1 -> "ONGOING";
            case 2 -> "ENDED";
            default -> "UNKNOWN";
        };
        
        return ClassResponse.builder()
                .classId(classEntity.getClassId() != null ? classEntity.getClassId().toString() : null)
                .classCode(classEntity.getClassCode())
                .className(classEntity.getClassName())
                .departmentId(classEntity.getDepartmentId())
                .advisorId(classEntity.getAdvisorId())
                .academicCohortId(classEntity.getAcademicCohortId())
                .maxSize(classEntity.getMaxSize())
                .status(classEntity.getStatus())
                .statusText(statusText)
                .note(classEntity.getNote())
                .isActive(classEntity.getIsActive())
                .build();
    }

    public ClassDetailResponse toDetailResponse(Class classEntity) {
        if (classEntity == null) return null;
        
        String statusText = switch (classEntity.getStatus() != null ? classEntity.getStatus() : 0) {
            case 0 -> "PLANNING";
            case 1 -> "ONGOING";
            case 2 -> "ENDED";
            default -> "UNKNOWN";
        };
        
        return ClassDetailResponse.builder()
                .classId(classEntity.getClassId() != null ? classEntity.getClassId().toString() : null)
                .classCode(classEntity.getClassCode())
                .className(classEntity.getClassName())
                .departmentId(classEntity.getDepartmentId())
                .advisorId(classEntity.getAdvisorId())
                .academicCohortId(classEntity.getAcademicCohortId())
                .maxSize(classEntity.getMaxSize())
                .status(classEntity.getStatus())
                .statusText(statusText)
                .note(classEntity.getNote())
                .isActive(classEntity.getIsActive())
                .createdAt(classEntity.getCreatedAt())
                .createdBy(classEntity.getCreatedBy() != null ? classEntity.getCreatedBy().toString() : null)
                .updatedAt(classEntity.getUpdatedAt())
                .updatedBy(classEntity.getUpdatedBy() != null ? classEntity.getUpdatedBy().toString() : null)
                .build();
    }
}
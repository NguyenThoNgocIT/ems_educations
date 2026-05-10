package com.quanlydaotao.backend.registration.mapper;

import com.quanlydaotao.backend.registration.dto.request.CreateRegistrationRequest;
import com.quanlydaotao.backend.registration.dto.request.UpdateRegistrationRequest;
import com.quanlydaotao.backend.registration.dto.response.RegistrationDetailResponse;
import com.quanlydaotao.backend.registration.dto.response.RegistrationResponse;
import com.quanlydaotao.backend.registration.entity.CourseRegistration;
import org.springframework.stereotype.Component;

import java.time.LocalDateTime;

@Component
public class RegistrationMapper {

    public CourseRegistration toEntity(CreateRegistrationRequest request) {
        if (request == null) return null;
        
        return CourseRegistration.builder()
                .studentId(request.getStudentId())
                .courseClassId(request.getCourseClassId())
                .registrationPeriodId(request.getRegistrationPeriodId())
                .registrationType(request.getRegistrationType() != null ? request.getRegistrationType() : 0)
                .build();
    }

    public void updateEntity(UpdateRegistrationRequest request, CourseRegistration registration) {
        if (request == null) return;
        if (request.getRegistrationPeriodId() != null) registration.setRegistrationPeriodId(request.getRegistrationPeriodId());
        if (request.getRegistrationType() != null) registration.setRegistrationType(request.getRegistrationType());
        if (request.getStatus() != null) registration.setStatus(request.getStatus());
        if (request.getIsPaid() != null) registration.setIsPaid(request.getIsPaid());
    }

    public RegistrationResponse toResponse(CourseRegistration registration) {
        if (registration == null) return null;
        
        String registrationTypeText = switch (registration.getRegistrationType() != null ? registration.getRegistrationType() : 0) {
            case 0 -> "Bình thường";
            case 1 -> "Học lại";
            case 2 -> "Cải thiện";
            default -> "Không xác định";
        };
        
        String statusText = switch (registration.getStatus() != null ? registration.getStatus() : 0) {
            case 0 -> "Chờ xác nhận";
            case 1 -> "Đã xác nhận";
            case 2 -> "Đã hủy";
            default -> "Không xác định";
        };
        
        return RegistrationResponse.builder()
                .courseRegistrationId(registration.getCourseRegistrationId())
                .studentId(registration.getStudentId())
                .courseClassId(registration.getCourseClassId())
                .registrationType(registration.getRegistrationType())
                .registrationTypeText(registrationTypeText)
                .status(registration.getStatus())
                .statusText(statusText)
                .isPaid(registration.getIsPaid())
                .registeredAt(registration.getRegisteredAt())
                .build();
    }

    public RegistrationDetailResponse toDetailResponse(CourseRegistration registration) {
        if (registration == null) return null;
        
        RegistrationResponse base = toResponse(registration);
        
        return RegistrationDetailResponse.builder()
                .courseRegistrationId(base.getCourseRegistrationId())
                .studentId(base.getStudentId())
                .studentCode(base.getStudentCode())
                .studentName(base.getStudentName())
                .courseClassId(base.getCourseClassId())
                .classCode(base.getClassCode())
                .courseName(base.getCourseName())
                .registrationType(base.getRegistrationType())
                .registrationTypeText(base.getRegistrationTypeText())
                .status(base.getStatus())
                .statusText(base.getStatusText())
                .isPaid(base.getIsPaid())
                .registeredAt(base.getRegisteredAt())
                .createdAt(registration.getCreatedAt())
                .createdBy(registration.getCreatedBy() != null ? registration.getCreatedBy().toString() : null)
                .updatedAt(registration.getUpdatedAt())
                .updatedBy(registration.getUpdatedBy() != null ? registration.getUpdatedBy().toString() : null)
                .build();
    }
}
package com.quanlydaotao.backend.registration.dto.response;

import lombok.Builder;
import lombok.Data;

import java.time.LocalDateTime;
import java.util.UUID;

@Data
@Builder
public class RegistrationDetailResponse {
    private UUID courseRegistrationId;
    private UUID studentId;
    private String studentCode;
    private String studentName;
    private UUID courseClassId;
    private String classCode;
    private String courseName;
    private Integer registrationType;
    private String registrationTypeText;
    private Integer status;
    private String statusText;
    private Boolean isPaid;
    private LocalDateTime registeredAt;
    private LocalDateTime createdAt;
    private String createdBy;
    private LocalDateTime updatedAt;
    private String updatedBy;
}
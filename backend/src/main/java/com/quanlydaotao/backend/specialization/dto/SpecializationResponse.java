package com.quanlydaotao.backend.specialization.dto;

import lombok.Data;

import java.time.LocalDateTime;
import java.util.UUID;

@Data
public class SpecializationResponse {
    private UUID specializationId;
    private UUID departmentId;
    private UUID majorId;
    private String code;
    private String name;
    private String description;
    private Boolean isActive;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}

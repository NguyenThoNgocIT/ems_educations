package com.quanlydaotao.backend.studentspecialization.dto;

import lombok.Data;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.UUID;

@Data
public class StudentSpecializationHistoryResponse {
    private UUID studentSpecializationHistoryId;
    private UUID studentId;
    private UUID majorId;
    private UUID specializationId;
    private UUID trainingProgramId;
    private UUID effectiveSemesterId;
    private LocalDate startDate;
    private LocalDate endDate;
    private Boolean isCurrent;
    private String reason;
    private Boolean isActive;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}

package com.quanlydaotao.backend.trainingprogram.dto;

import lombok.Data;
import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.UUID;

@Data
public class TrainingProgramResponse {
    private UUID trainingProgramId;
    private String code;
    private String name;
    private String nameEn;
    private UUID majorId;
    private UUID specializationId;
    private UUID departmentId;
    private UUID academicCohortId;
    private String programPhase;
    private String degreeLevel;
    private String educationType;
    private Integer totalCredits;
    private BigDecimal requiredCredits;
    private BigDecimal electiveCredits;
    private BigDecimal internshipCredits;
    private BigDecimal thesisCredits;
    private LocalDate admissionYear;
    private BigDecimal durationYears;
    private BigDecimal maxDurationYears;
    private LocalDate effectiveDate;
    private LocalDate expiryDate;
    private String description;
    private String objectives;
    private String learningOutcomes;
    private String version;
    private String status;
    private Boolean isActive;
}

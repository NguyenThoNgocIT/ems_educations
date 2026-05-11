package com.quanlydaotao.backend.trainingprogram.dto.response;

import lombok.Builder;
import lombok.Data;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;

@Data
@Builder
public class TrainingProgramDetailResponse {
    private String trainingProgramId;
    private String code;
    private String name;
    private String nameEn;
    private String majorId;
    private String departmentId;
    private String academicCohortId;
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
    private Boolean isActive;
    private LocalDateTime createdAt;
    private String createdBy;
    private LocalDateTime updatedAt;
    private String updatedBy;
}
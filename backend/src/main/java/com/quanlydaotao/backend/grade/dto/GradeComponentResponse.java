package com.quanlydaotao.backend.grade.dto;

import lombok.Data;

import java.math.BigDecimal;
import java.util.UUID;

@Data
public class GradeComponentResponse {
    private UUID gradeComponentId;
    private UUID courseId;
    private String courseCode;
    private String courseName;
    private String componentCode;
    private String componentName;
    private BigDecimal weightPercentage;
    private BigDecimal minScore;
    private BigDecimal maxScore;
    private Boolean isRequired;
    private Integer inputOrder;
    private String description;
    private Boolean isActive;
}

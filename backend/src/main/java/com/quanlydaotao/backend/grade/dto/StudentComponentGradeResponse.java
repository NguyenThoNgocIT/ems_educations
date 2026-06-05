package com.quanlydaotao.backend.grade.dto;

import lombok.Data;

import java.math.BigDecimal;
import java.util.UUID;

@Data
public class StudentComponentGradeResponse {
    private UUID courseRegistrationId;
    private UUID gradeComponentId;
    private String componentCode;
    private String componentName;
    private BigDecimal weightPercentage;
    private BigDecimal score;
    private Boolean isLocked;
    private String note;
}

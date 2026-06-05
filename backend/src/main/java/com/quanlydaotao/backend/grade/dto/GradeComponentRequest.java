package com.quanlydaotao.backend.grade.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

import java.math.BigDecimal;
import java.util.UUID;

@Data
public class GradeComponentRequest {
    @NotNull(message = "Học phần không được để trống")
    private UUID courseId;
    @NotBlank(message = "Mã cột điểm không được để trống")
    private String componentCode;
    @NotBlank(message = "Tên cột điểm không được để trống")
    private String componentName;
    private BigDecimal weightPercentage;
    private BigDecimal minScore;
    private BigDecimal maxScore;
    private Boolean isRequired;
    private Integer inputOrder;
    private String description;
}

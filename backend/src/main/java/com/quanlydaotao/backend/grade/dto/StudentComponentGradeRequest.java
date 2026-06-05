package com.quanlydaotao.backend.grade.dto;

import jakarta.validation.constraints.NotNull;
import lombok.Data;

import java.math.BigDecimal;
import java.util.UUID;

@Data
public class StudentComponentGradeRequest {
    @NotNull(message = "Cột điểm không được để trống")
    private UUID gradeComponentId;
    @NotNull(message = "Điểm không được để trống")
    private BigDecimal score;
    private String note;
}

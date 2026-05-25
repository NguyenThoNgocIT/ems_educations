package com.quanlydaotao.backend.course.dto;

import jakarta.validation.constraints.NotNull;
import lombok.Data;

import java.util.UUID;

@Data
public class RetakeImprovementRegistrationRequest {
    @NotNull(message = "Lớp học phần không được để trống")
    private UUID courseClassId;
}

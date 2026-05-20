package com.quanlydaotao.backend.specialization.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

import java.util.UUID;

@Data
public class SpecializationRequest {
    @NotNull(message = "Khoa không được để trống")
    private UUID departmentId;

    @NotNull(message = "Ngành không được để trống")
    private UUID majorId;

    @NotBlank(message = "Mã chuyên ngành không được để trống")
    private String code;

    @NotBlank(message = "Tên chuyên ngành không được để trống")
    private String name;

    private String description;
    private Boolean isActive;
}

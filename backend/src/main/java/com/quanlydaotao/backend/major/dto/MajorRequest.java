package com.quanlydaotao.backend.major.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;
import java.time.LocalDate;
import java.util.UUID;

@Data
public class MajorRequest {
    @NotBlank(message = "Mã ngành không được để trống")
    private String code;
    
    @NotBlank(message = "Tên ngành không được để trống")
    private String name;
    
    private String description;
    
    @NotNull(message = "Khoa không được để trống")
    private UUID departmentId;
    
    private LocalDate effectiveDate;
    private LocalDate expiryDate;
    private Boolean isActive;
}
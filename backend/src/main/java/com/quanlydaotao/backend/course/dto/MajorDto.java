package com.quanlydaotao.backend.course.dto;

import lombok.Data;
import java.time.LocalDate;
import java.util.UUID;

@Data
public class MajorDto {
    private UUID majorId;
    private UUID departmentId;
    private String code;          // ✅ majorCode -> code
    private String name;          // ✅ majorName -> name
    private String description;
    private Boolean isActive;
    private LocalDate effectiveDate;
    private LocalDate expiryDate;
}
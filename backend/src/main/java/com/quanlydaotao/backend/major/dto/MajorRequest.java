package com.quanlydaotao.backend.major.dto;

import lombok.Data;
import java.time.LocalDate;
import java.util.UUID;

@Data
public class MajorRequest {
    private String code;          // ✅ majorCode -> code
    private String name;          // ✅ majorName -> name
    private String description;
    private UUID departmentId;
    private LocalDate effectiveDate;
    private LocalDate expiryDate;
    private Boolean isActive;
}

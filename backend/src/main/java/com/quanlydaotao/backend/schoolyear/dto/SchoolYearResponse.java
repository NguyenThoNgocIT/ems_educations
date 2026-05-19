package com.quanlydaotao.backend.schoolyear.dto;

import lombok.Builder;
import lombok.Data;

import java.time.LocalDate;
import java.util.UUID;

@Data
@Builder
public class SchoolYearResponse {
    private UUID schoolYearId;
    private String code;
    private String name;
    private LocalDate startDate;
    private LocalDate endDate;
    private String description;
    private String schoolYearName;
    private String note;
    private Boolean isActive;
}

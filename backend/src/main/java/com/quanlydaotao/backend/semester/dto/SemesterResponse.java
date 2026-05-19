package com.quanlydaotao.backend.semester.dto;

import lombok.Builder;
import lombok.Data;

import java.time.LocalDate;
import java.util.UUID;

@Data
@Builder
public class SemesterResponse {
    private UUID semesterId;
    private String code;
    private String name;
    private UUID schoolYearId;
    private LocalDate startDate;
    private LocalDate endDate;
    private Boolean status;
    private String description;
    private Boolean isActive;
}

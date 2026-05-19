package com.quanlydaotao.backend.academiccohort.dto;

import lombok.Builder;
import lombok.Data;

import java.time.LocalDate;
import java.util.UUID;

@Data
@Builder
public class AcademicCohortResponse {
    private UUID cohortId;
    private String code;
    private String name;
    private Integer startYear;
    private Integer endYear;
    private LocalDate startDate;
    private LocalDate endDate;
    private String description;
    private Boolean isActive;
}

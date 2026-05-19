package com.quanlydaotao.backend.academiccohort.dto;

import lombok.Data;

import java.time.LocalDate;

@Data
public class AcademicCohortRequest {
    private String code;
    private String name;
    private Integer startYear;
    private Integer endYear;
    private LocalDate startDate;
    private LocalDate endDate;
    private String description;
    private Boolean isActive;
}

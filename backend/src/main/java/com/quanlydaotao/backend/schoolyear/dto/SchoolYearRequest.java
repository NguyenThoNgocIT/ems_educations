package com.quanlydaotao.backend.schoolyear.dto;

import lombok.Data;

import java.time.LocalDate;

@Data
public class SchoolYearRequest {
    private String code;
    private String name;
    private LocalDate startDate;
    private LocalDate endDate;
    private String description;
    private String schoolYearName;
    private String note;
    private Boolean isActive;
}

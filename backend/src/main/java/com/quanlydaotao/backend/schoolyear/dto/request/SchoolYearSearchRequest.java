package com.quanlydaotao.backend.schoolyear.dto.request;

import lombok.Data;
import java.time.LocalDate;

@Data
public class SchoolYearSearchRequest {
    private String code;
    private String name;
    private LocalDate startDateFrom;
    private LocalDate startDateTo;
    private Boolean isActive;
}
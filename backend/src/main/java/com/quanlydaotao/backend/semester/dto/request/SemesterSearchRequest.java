package com.quanlydaotao.backend.semester.dto.request;

import lombok.Data;
import java.time.LocalDate;

@Data
public class SemesterSearchRequest {
    private String code;
    private String name;
    private Integer status;
    private String schoolYearId;
    private LocalDate startDateFrom;
    private LocalDate startDateTo;
    private Boolean isActive;
}
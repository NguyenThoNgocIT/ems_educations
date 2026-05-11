package com.quanlydaotao.backend.semester.dto.response;

import lombok.Builder;
import lombok.Data;
import java.time.LocalDate;

@Data
@Builder
public class SemesterResponse {
    private String semesterId;
    private String code;
    private String name;
    private String schoolYearId;
    private String schoolYearCode;
    private String schoolYearName;
    private LocalDate startDate;
    private LocalDate endDate;
    private Integer status;
    private String statusText;
    private String description;
    private Boolean isActive;
}
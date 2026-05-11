package com.quanlydaotao.backend.schoolyear.dto.response;

import lombok.Builder;
import lombok.Data;
import java.time.LocalDate;

@Data
@Builder
public class SchoolYearResponse {
    private String schoolYearId;
    private String code;
    private String name;
    private LocalDate startDate;
    private LocalDate endDate;
    private String description;
    private Boolean isActive;
    private Boolean isCurrent; // Tính toán từ date hiện tại
}
package com.quanlydaotao.backend.schoolyear.dto.response;

import lombok.Builder;
import lombok.Data;
import java.time.LocalDate;
import java.time.LocalDateTime;

@Data
@Builder
public class SchoolYearDetailResponse {
    private String schoolYearId;
    private String code;
    private String name;
    private LocalDate startDate;
    private LocalDate endDate;
    private String description;
    private Boolean isActive;
    private Boolean isCurrent;
    private LocalDateTime createdAt;
    private String createdBy;
    private LocalDateTime updatedAt;
    private String updatedBy;
    
    // Thông tin bổ sung
    private Long daysRemaining;
    private Integer totalSemesters;
}
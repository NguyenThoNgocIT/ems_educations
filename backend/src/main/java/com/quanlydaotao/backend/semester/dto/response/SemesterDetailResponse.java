package com.quanlydaotao.backend.semester.dto.response;

import lombok.Builder;
import lombok.Data;
import java.time.LocalDate;
import java.time.LocalDateTime;

@Data
@Builder
public class SemesterDetailResponse {
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
    private LocalDateTime createdAt;
    private String createdBy;
    private LocalDateTime updatedAt;
    private String updatedBy;
    
    // Thông tin bổ sung
    private Long daysRemaining;
    private Boolean isRegistrationOpen;
}
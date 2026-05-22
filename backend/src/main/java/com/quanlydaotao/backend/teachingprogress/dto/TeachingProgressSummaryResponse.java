package com.quanlydaotao.backend.teachingprogress.dto;

import lombok.Builder;
import lombok.Data;

import java.time.LocalDate;
import java.util.UUID;

@Data
@Builder
public class TeachingProgressSummaryResponse {
    private UUID courseClassId;
    private String courseClassCode;
    private String courseName;
    private Double credits;
    private LocalDate startDate;
    private LocalDate endDate;
    private Integer requiredPeriods;
    private Long instructorAbsentSessions;
    private Integer taughtPeriods;
    private Integer remainingPeriods;
}

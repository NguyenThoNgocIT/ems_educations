package com.quanlydaotao.backend.scheduling.dto;

import lombok.Builder;
import lombok.Data;

import java.time.LocalDate;
import java.util.UUID;

@Data
@Builder
public class ScheduleTeachingProgressReportResponse {
    private UUID courseClassId;
    private String courseClassCode;
    private UUID semesterId;
    private String semesterCode;
    private String semesterName;
    private LocalDate semesterStartDate;
    private LocalDate semesterEndDate;
    private String courseName;
    private Double credits;
    private LocalDate startDate;
    private LocalDate endDate;
    private Integer requiredPeriods;
    private Long instructorAbsentSessions;
    private Integer taughtPeriods;
    private Integer remainingPeriods;
    private String alertStatus;
}

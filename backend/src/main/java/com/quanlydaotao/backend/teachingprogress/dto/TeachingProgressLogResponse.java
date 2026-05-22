package com.quanlydaotao.backend.teachingprogress.dto;

import lombok.Data;

import java.time.LocalDate;
import java.util.UUID;

@Data
public class TeachingProgressLogResponse {
    private UUID teachingProgressLogId;
    private UUID courseClassId;
    private UUID scheduleId;
    private UUID instructorId;
    private LocalDate teachingDate;
    private Integer plannedPeriods;
    private Integer actualPeriods;
    private Boolean isInstructorAbsent;
    private String status;
    private String note;
    private Boolean isActive;
}

package com.quanlydaotao.backend.scheduling.dto;

import lombok.Builder;
import lombok.Data;

import java.time.LocalDate;
import java.util.UUID;

@Data
@Builder
public class InstructorCourseClassSummaryResponse {
    private UUID courseClassId;
    private String courseClassCode;
    private UUID courseId;
    private String courseCode;
    private String courseName;
    private Double credits;
    private UUID semesterId;
    private LocalDate startDate;
    private LocalDate endDate;
    private Integer requiredPeriods;
    private Integer taughtPeriods;
    private Integer remainingPeriods;
    private String fixedScheduleText;
}

package com.quanlydaotao.backend.teachingprogress.dto;

import jakarta.validation.constraints.NotNull;
import lombok.Data;

import java.time.LocalDate;
import java.util.UUID;

@Data
public class TeachingProgressLogRequest {
    @NotNull(message = "Lớp học phần không được để trống")
    private UUID courseClassId;
    private UUID scheduleId;
    private UUID instructorId;
    @NotNull(message = "Ngày dạy không được để trống")
    private LocalDate teachingDate;
    private Integer plannedPeriods;
    private Integer actualPeriods;
    private Boolean isInstructorAbsent;
    private String status;
    private String note;
}

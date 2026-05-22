package com.quanlydaotao.backend.student.dto;

import lombok.Builder;
import lombok.Data;

import java.time.LocalDate;
import java.time.LocalTime;
import java.util.UUID;

@Data
@Builder
public class StudentPortalScheduleResponse {
    private UUID scheduleId;
    private Integer dayOfWeek;
    private LocalDate date;
    private LocalTime startTime;
    private LocalTime endTime;
    private String courseCode;
    private String courseName;
    private String classCode;
    private String roomCode;
    private String instructorName;
    private String mode;
}

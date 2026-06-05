package com.quanlydaotao.backend.scheduling.dto;

import lombok.Builder;
import lombok.Data;

import java.time.LocalTime;
import java.util.UUID;

@Data
@Builder
public class ScheduleCalendarItemDto {
    private UUID id;
    private UUID courseClassId;
    private String courseClassCode;
    private String courseClassName;
    private String courseName;
    private UUID timeSlotId;
    private String timeSlotLabel;
    private LocalTime startTime;
    private LocalTime endTime;
    private Integer numberOfPeriods;
    private UUID roomId;
    private String roomCode;
    private String mode;
    private String status;
    private String note;
}

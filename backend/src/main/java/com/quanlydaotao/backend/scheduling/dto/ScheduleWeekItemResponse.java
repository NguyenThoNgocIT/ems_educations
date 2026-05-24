package com.quanlydaotao.backend.scheduling.dto;

import lombok.Builder;
import lombok.Data;

import java.time.LocalDate;
import java.util.UUID;

@Data
@Builder
public class ScheduleWeekItemResponse {
    private LocalDate date;
    private String dayLabel;
    private UUID courseClassId;
    private String courseClassCode;
    private String courseName;
    private UUID timeSlotId;
    private String timeSlotLabel;
    private UUID roomId;
    private String roomCode;
    private String status;
    private String note;
}

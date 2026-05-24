package com.quanlydaotao.backend.scheduling.dto;

import lombok.Builder;
import lombok.Data;

import java.util.UUID;

@Data
@Builder
public class ScheduleCalendarItemDto {
    private UUID id;
    private UUID courseClassId;
    private String courseClassCode;
    private UUID timeSlotId;
    private String timeSlotLabel;
    private UUID roomId;
    private String roomCode;
    private String status;
    private String note;
}

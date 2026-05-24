package com.quanlydaotao.backend.scheduling.dto;

import lombok.Builder;
import lombok.Data;

import java.time.LocalDate;
import java.util.UUID;

@Data
@Builder
public class FixedSessionResponse {
    private UUID scheduleId;
    private UUID courseClassId;
    private LocalDate date;
    private Integer dayOfWeek;
    private String dayLabel;
    private UUID timeSlotId;
    private String slotCode;
    private String timeSlotLabel;
    private UUID roomId;
    private String roomCode;
    private Integer numberOfPeriods;
    private String status;
}

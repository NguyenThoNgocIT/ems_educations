package com.quanlydaotao.backend.scheduleadjustment.dto;

import lombok.Builder;
import lombok.Data;

import java.time.LocalDate;
import java.time.LocalTime;
import java.util.List;
import java.util.UUID;

@Data
@Builder
public class ScheduleAdjustmentSuggestionItemResponse {
    private LocalDate date;
    private Integer dayOfWeek;
    private String dayLabel;
    private UUID timeSlotId;
    private String slotCode;
    private String timeSlotLabel;
    private LocalTime startTime;
    private LocalTime endTime;
    private UUID roomId;
    private String roomCode;
    private String roomName;
    private UUID buildingId;
    private String buildingName;
    private Integer floorNumber;
    private Integer capacity;
    private Integer proposedPeriods;
    private Integer score;
    private List<ScheduleAdjustmentSuggestionCheckResponse> checks;
    private List<String> warnings;
}

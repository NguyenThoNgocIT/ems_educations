package com.quanlydaotao.backend.scheduling.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalTime;
import java.util.UUID;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class TimeSlotDto {
    private UUID timeSlotId;
    private String slotCode;
    private LocalTime startTime;
    private LocalTime endTime;
    private Boolean isActive;
}

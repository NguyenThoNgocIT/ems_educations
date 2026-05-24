package com.quanlydaotao.backend.scheduleadjustment.dto;

import lombok.Builder;
import lombok.Data;

import java.time.LocalTime;
import java.util.UUID;

@Data
@Builder
public class ProposedSlotStatusDto {
    private UUID timeSlotId;
    private String slotCode;
    private String label;
    private LocalTime startTime;
    private LocalTime endTime;
    private String status;
    private String conflictReason;
}

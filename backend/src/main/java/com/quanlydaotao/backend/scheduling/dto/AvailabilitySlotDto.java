package com.quanlydaotao.backend.scheduling.dto;

import lombok.Builder;
import lombok.Data;

import java.util.UUID;

@Data
@Builder
public class AvailabilitySlotDto {
    private UUID timeSlotId;
    private String slotCode;
    private String label;
    private String reason;
    private UUID courseClassId;
    private String courseClassCode;
}

package com.quanlydaotao.backend.scheduling.dto;

import lombok.Builder;
import lombok.Data;

import java.time.LocalDate;
import java.util.List;
import java.util.UUID;

@Data
@Builder
public class InstructorAvailabilityResponse {
    private UUID instructorId;
    private LocalDate date;
    private Boolean hasLeave;
    private List<AvailabilitySlotDto> busySlots;
    private List<AvailabilitySlotDto> freeSlots;
}

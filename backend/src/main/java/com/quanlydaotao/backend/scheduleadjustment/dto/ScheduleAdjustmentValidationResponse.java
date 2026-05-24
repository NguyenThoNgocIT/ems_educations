package com.quanlydaotao.backend.scheduleadjustment.dto;

import lombok.Builder;
import lombok.Data;

import java.util.List;

@Data
@Builder
public class ScheduleAdjustmentValidationResponse {
    private Boolean valid;
    private List<ValidationResultDto> results;
    private List<ProposedSlotStatusDto> proposedSlots;
    private List<ProposedRoomStatusDto> proposedRooms;
}

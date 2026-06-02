package com.quanlydaotao.backend.scheduleadjustment.dto;

import lombok.Builder;
import lombok.Data;

import java.time.LocalDate;
import java.util.List;
import java.util.UUID;

@Data
@Builder
public class ScheduleAdjustmentSuggestionResponse {
    private UUID courseClassId;
    private UUID instructorId;
    private String requestType;
    private LocalDate fromDate;
    private LocalDate toDate;
    private Integer proposedPeriods;
    private Integer totalCandidates;
    private Integer validCandidates;
    private List<ScheduleAdjustmentSuggestionItemResponse> suggestions;
}

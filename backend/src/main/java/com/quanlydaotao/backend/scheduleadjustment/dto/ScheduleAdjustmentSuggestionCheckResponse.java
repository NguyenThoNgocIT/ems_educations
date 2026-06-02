package com.quanlydaotao.backend.scheduleadjustment.dto;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class ScheduleAdjustmentSuggestionCheckResponse {
    private String rule;
    private String status;
    private String message;
}

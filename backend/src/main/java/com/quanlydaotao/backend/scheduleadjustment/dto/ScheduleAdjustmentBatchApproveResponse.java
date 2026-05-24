package com.quanlydaotao.backend.scheduleadjustment.dto;

import lombok.Builder;
import lombok.Data;

import java.util.List;
import java.util.UUID;

@Data
@Builder
public class ScheduleAdjustmentBatchApproveResponse {
    private List<UUID> successIds;
    private List<UUID> failedIds;
    private List<String> errors;
}

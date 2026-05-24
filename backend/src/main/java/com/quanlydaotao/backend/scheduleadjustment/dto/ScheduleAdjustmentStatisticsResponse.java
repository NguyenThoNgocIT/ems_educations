package com.quanlydaotao.backend.scheduleadjustment.dto;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class ScheduleAdjustmentStatisticsResponse {
    private Long totalRequests;
    private Long pendingRequests;
    private Long approvedRequests;
    private Long rejectedRequests;
    private Long returnedRequests;
    private Long conflictDetectedRequests;
    private Double approvalRate;
}

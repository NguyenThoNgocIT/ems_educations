package com.quanlydaotao.backend.scheduleadjustment.dto;

import jakarta.validation.constraints.NotEmpty;
import lombok.Data;

import java.util.List;
import java.util.UUID;

@Data
public class ScheduleAdjustmentBatchApproveRequest {
    @NotEmpty(message = "Danh sách yêu cầu duyệt không được để trống")
    private List<UUID> requestIds;
    private UUID reviewedBy;
    private String note;
}

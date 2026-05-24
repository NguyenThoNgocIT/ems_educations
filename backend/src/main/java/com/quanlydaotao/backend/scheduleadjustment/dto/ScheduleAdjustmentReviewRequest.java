package com.quanlydaotao.backend.scheduleadjustment.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.Data;

import java.util.UUID;

@Data
public class ScheduleAdjustmentReviewRequest {
    private UUID reviewedBy;
    @NotBlank(message = "Ghi chú không được để trống")
    private String note;
}

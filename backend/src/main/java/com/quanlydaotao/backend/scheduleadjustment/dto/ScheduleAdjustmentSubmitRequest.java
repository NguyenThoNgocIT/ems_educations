package com.quanlydaotao.backend.scheduleadjustment.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.Data;
import lombok.EqualsAndHashCode;

@Data
@EqualsAndHashCode(callSuper = true)
public class ScheduleAdjustmentSubmitRequest extends ScheduleAdjustmentValidateRequest {
    @NotBlank(message = "Lý do điều chỉnh không được để trống")
    private String reason;
}

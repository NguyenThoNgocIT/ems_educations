package com.quanlydaotao.backend.scheduleadjustment.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

import java.time.LocalDate;
import java.util.UUID;

@Data
public class ScheduleAdjustmentValidateRequest {
    @NotNull(message = "Lớp học phần không được để trống")
    private UUID courseClassId;
    private UUID originalScheduleId;
    private UUID requestedByInstructorId;
    @NotBlank(message = "Loại yêu cầu không được để trống")
    private String requestType;
    private LocalDate absentDate;
    private UUID absentTimeSlotId;
    private Integer absentPeriods;
    private LocalDate proposedDate;
    private UUID proposedTimeSlotId;
    private UUID proposedRoomId;
    private Integer proposedPeriods;
}

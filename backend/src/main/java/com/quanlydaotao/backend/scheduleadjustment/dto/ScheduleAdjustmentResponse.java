package com.quanlydaotao.backend.scheduleadjustment.dto;

import lombok.Data;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.UUID;

@Data
public class ScheduleAdjustmentResponse {
    private UUID requestId;
    private UUID courseClassId;
    private UUID originalScheduleId;
    private UUID requestedByInstructorId;
    private String requestType;
    private LocalDate absentDate;
    private UUID absentTimeSlotId;
    private Integer absentPeriods;
    private LocalDate proposedDate;
    private UUID proposedTimeSlotId;
    private UUID proposedRoomId;
    private Integer proposedPeriods;
    private String reason;
    private String status;
    private String adminNote;
    private UUID reviewedBy;
    private LocalDateTime reviewedAt;
    private Boolean isActive;
    private LocalDateTime createdAt;
}

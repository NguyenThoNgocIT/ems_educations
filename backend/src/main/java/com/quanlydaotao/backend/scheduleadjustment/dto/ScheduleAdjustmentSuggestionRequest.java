package com.quanlydaotao.backend.scheduleadjustment.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

import java.time.LocalDate;
import java.util.List;
import java.util.UUID;

@Data
public class ScheduleAdjustmentSuggestionRequest {
    @NotNull(message = "Lop hoc phan khong duoc de trong")
    private UUID courseClassId;

    private UUID originalScheduleId;
    private UUID requestedByInstructorId;

    @NotBlank(message = "Loai yeu cau khong duoc de trong")
    private String requestType;

    private LocalDate absentDate;
    private UUID absentTimeSlotId;
    private Integer absentPeriods;
    private Integer proposedPeriods;

    private LocalDate fromDate;
    private LocalDate toDate;
    private List<Integer> preferredDayOfWeeks;
    private List<UUID> preferredTimeSlotIds;
    private UUID preferredRoomId;
    private UUID preferredBuildingId;
    private Boolean preferSameRoom;
    private Integer maxSuggestions;
}

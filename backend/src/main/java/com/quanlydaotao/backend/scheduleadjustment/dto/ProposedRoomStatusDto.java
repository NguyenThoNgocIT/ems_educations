package com.quanlydaotao.backend.scheduleadjustment.dto;

import lombok.Builder;
import lombok.Data;

import java.util.UUID;

@Data
@Builder
public class ProposedRoomStatusDto {
    private UUID roomId;
    private String roomCode;
    private String roomName;
    private UUID buildingId;
    private String buildingName;
    private Integer floorNumber;
    private Integer capacity;
    private String status;
    private String conflictReason;
}

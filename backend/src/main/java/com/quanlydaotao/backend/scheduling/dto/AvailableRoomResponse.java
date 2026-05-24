package com.quanlydaotao.backend.scheduling.dto;

import lombok.Builder;
import lombok.Data;

import java.util.UUID;

@Data
@Builder
public class AvailableRoomResponse {
    private UUID roomId;
    private String roomCode;
    private String roomName;
    private UUID buildingId;
    private String buildingName;
    private Integer floorNumber;
    private Integer capacity;
    private String type;
    private String status;
}

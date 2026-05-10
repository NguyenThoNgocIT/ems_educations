package com.quanlydaotao.backend.facility.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.UUID;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class RoomDto {
    private UUID roomId;
    private String code;
    private String name;
    private UUID buildingId;
    private String buildingName;
    private Integer floorNumber;
    private Integer capacity;
    private String type;
    private String status;
    private Boolean hasProjector;
    private Boolean hasAirConditioner;
    private Boolean hasComputer;
    private String description;
}

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
public class FloorDto {
    private UUID floorId;
    private String code;
    private String name;
    private Integer floorNumber;
    private UUID buildingId;
    private String description;
}

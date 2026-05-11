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
public class BuildingDto {
    private UUID buildingId;
    private String code;
    private String name;
    private String address;
    private Integer totalFloors;
    private String buildingType;
    private String description;
    private String note;
}

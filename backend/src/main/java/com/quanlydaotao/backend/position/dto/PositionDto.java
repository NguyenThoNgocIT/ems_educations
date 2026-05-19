package com.quanlydaotao.backend.position.dto;

import lombok.Builder;
import lombok.Data;

import java.math.BigDecimal;
import java.util.UUID;

@Data
@Builder
public class PositionDto {
    private UUID positionId;
    private String code;
    private String name;
    private BigDecimal allowance;
    private String description;
    private String level;
    private UUID divisionId;
    private Boolean isActive;
}

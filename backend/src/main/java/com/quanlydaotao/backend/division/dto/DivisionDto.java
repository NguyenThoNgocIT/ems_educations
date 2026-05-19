package com.quanlydaotao.backend.division.dto;

import lombok.Builder;
import lombok.Data;

import java.util.UUID;

@Data
@Builder
public class DivisionDto {
    private UUID divisionId;
    private String code;
    private String name;
    private String description;
    private Boolean isActive;
}

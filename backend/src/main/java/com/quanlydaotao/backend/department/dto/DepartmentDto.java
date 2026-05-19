package com.quanlydaotao.backend.department.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.UUID;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class DepartmentDto {
    private UUID departmentId;
    private String code;
    private String name;
    private String description;
    private Boolean isActive;
}


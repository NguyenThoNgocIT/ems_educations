package com.quanlydaotao.backend.role.dto;

import lombok.Data;

import java.time.LocalDateTime;
import java.util.UUID;

@Data
public class PermissionDto {
    private UUID permissionId;
    private String code;
    private String name;
    private String description;
    private String module;
    private Boolean isActive;
    private Long apiCount;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}

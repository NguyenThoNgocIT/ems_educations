package com.quanlydaotao.backend.role.dto;

import lombok.Data;

import java.util.UUID;

@Data
public class PermissionApiDto {
    private UUID permissionId;
    private String permissionCode;
    private String apiPath;
    private String httpMethod;
    private String description;
    private Boolean isActive;
}

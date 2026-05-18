package com.quanlydaotao.backend.role.dto;

import lombok.Data;

import java.time.LocalDateTime;
import java.util.UUID;

@Data
public class MenuDto {
    private UUID menuId;
    private UUID parentId;
    private String menuTitle;
    private String menuUrl;
    private String menuIcon;
    private Integer orderIndex;
    private Integer menuType;
    private UUID permissionId;
    private String permissionCode;
    private Boolean isActive;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}

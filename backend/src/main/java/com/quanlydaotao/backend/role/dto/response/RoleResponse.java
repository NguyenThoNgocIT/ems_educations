package com.quanlydaotao.backend.role.dto.response;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class RoleResponse {
    private String roleId;
    private String code;
    private String name;
    private String description;
    private Integer level;
    private Boolean isSystem;
    private Integer displayOrder;
    private String color;
    private Boolean isActive;
}
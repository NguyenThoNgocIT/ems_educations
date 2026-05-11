package com.quanlydaotao.backend.role.dto;
import lombok.Data;
import java.util.UUID;
@Data
public class RoleDto {
    private UUID roleId;
    private String code;
    private String name;
    private String description;
    private Integer level;
    private Boolean isSystem;
    private Integer displayOrder;
    private String color;
    private Boolean isActive;
}

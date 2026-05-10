package com.quanlydaotao.backend.role.dto.request;

import lombok.Data;

@Data
public class UpdateRoleRequest {
    
    private String code;
    
    private String name;
    
    private String description;
    
    private Integer level;
    
    private Boolean isSystem;
    
    private Integer displayOrder;
    
    private String color;
    
    private Boolean isActive;
}
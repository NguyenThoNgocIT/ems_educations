package com.quanlydaotao.backend.role.dto.request;

import jakarta.validation.constraints.NotBlank;
import lombok.Data;

@Data
public class CreateRoleRequest {
    
    @NotBlank(message = "Mã vai trò không được để trống")
    private String code;
    
    @NotBlank(message = "Tên vai trò không được để trống")
    private String name;
    
    private String description;
    
    private Integer level;
    
    private Boolean isSystem = false;
    
    private Integer displayOrder;
    
    private String color;
}
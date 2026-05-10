package com.quanlydaotao.backend.major.dto.request;

import jakarta.validation.constraints.Size;
import lombok.Data;

@Data
public class UpdateMajorRequest {
    
    @Size(max = 20, message = "Mã chuyên ngành tối đa 20 ký tự")
    private String code;
    
    @Size(max = 255, message = "Tên chuyên ngành tối đa 255 ký tự")
    private String name;
    
    private String departmentId;
    
    private String description;
    
    private Boolean isActive;
}
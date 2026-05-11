package com.quanlydaotao.backend.department.dto.request;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.Data;

@Data
public class CreateDepartmentRequest {
    
    @NotBlank(message = "Mã khoa không được để trống")
    @Size(max = 50, message = "Mã khoa tối đa 50 ký tự")
    private String code;
    
    @NotBlank(message = "Tên khoa không được để trống")
    @Size(max = 150, message = "Tên khoa tối đa 150 ký tự")
    private String name;
    
    @Size(max = 255, message = "Mô tả tối đa 255 ký tự")
    private String description;
}
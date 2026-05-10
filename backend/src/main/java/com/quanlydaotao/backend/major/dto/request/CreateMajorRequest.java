package com.quanlydaotao.backend.major.dto.request;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.Data;

@Data
public class CreateMajorRequest {
    
    @NotBlank(message = "Mã chuyên ngành không được để trống")
    @Size(max = 20, message = "Mã chuyên ngành tối đa 20 ký tự")
    private String code;
    
    @NotBlank(message = "Tên chuyên ngành không được để trống")
    @Size(max = 255, message = "Tên chuyên ngành tối đa 255 ký tự")
    private String name;
    
    @NotNull(message = "Khoa không được để trống")
    private String departmentId;
    
    private String description;
}
package com.quanlydaotao.backend.classmanagement.dto.request;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.Data;

@Data
public class CreateClassRequest {
    
    @NotBlank(message = "Mã lớp không được để trống")
    @Size(max = 50, message = "Mã lớp tối đa 50 ký tự")
    private String classCode;
    
    @NotBlank(message = "Tên lớp không được để trống")
    @Size(max = 100, message = "Tên lớp tối đa 100 ký tự")
    private String className;
    
    private String departmentId;
    
    private String advisorId;
    
    private String academicCohortId;
    
    private Integer maxSize;
    
    private Integer status;
    
    private String note;
}
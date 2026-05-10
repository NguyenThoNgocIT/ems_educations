package com.quanlydaotao.backend.classmanagement.dto.request;

import lombok.Data;

@Data
public class UpdateClassRequest {
    
    private String classCode;
    
    private String className;
    
    private String departmentId;
    
    private String advisorId;
    
    private String academicCohortId;
    
    private Integer maxSize;
    
    private Integer status;
    
    private String note;
    
    private Boolean isActive;
}
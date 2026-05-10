package com.quanlydaotao.backend.classmanagement.dto.request;

import lombok.Data;

@Data
public class ClassSearchRequest {
    private String classCode;
    private String className;
    private String departmentId;
    private String advisorId;
    private String academicCohortId;
    private Integer status;
    private Boolean isActive;
}
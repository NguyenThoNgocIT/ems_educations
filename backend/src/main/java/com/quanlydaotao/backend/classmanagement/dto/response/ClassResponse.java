package com.quanlydaotao.backend.classmanagement.dto.response;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class ClassResponse {
    private String classId;
    private String classCode;
    private String className;
    private String departmentId;
    private String advisorId;
    private String academicCohortId;
    private Integer maxSize;
    private Integer status;
    private String statusText;
    private String note;
    private Boolean isActive;
}
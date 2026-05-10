package com.quanlydaotao.backend.classmanagement.dto.response;

import lombok.Builder;
import lombok.Data;
import java.time.LocalDateTime;

@Data
@Builder
public class ClassDetailResponse {
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
    private LocalDateTime createdAt;
    private String createdBy;
    private LocalDateTime updatedAt;
    private String updatedBy;
}
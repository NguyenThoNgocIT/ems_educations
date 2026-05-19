package com.quanlydaotao.backend.administrativeclass.dto;

import lombok.Data;

import java.util.UUID;

@Data
public class AdministrativeClassRequest {
    private String classCode;
    private String className;
    private UUID departmentId;
    private UUID advisorId;
    private UUID academicCohortId;
    private Integer maxSize;
    private Integer status;
    private String note;
    private Boolean isActive;
}

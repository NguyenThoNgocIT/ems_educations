package com.quanlydaotao.backend.administrativeclass.dto;

import lombok.Builder;
import lombok.Data;

import java.util.UUID;

@Data
@Builder
public class AdministrativeClassResponse {
    private UUID classId;
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

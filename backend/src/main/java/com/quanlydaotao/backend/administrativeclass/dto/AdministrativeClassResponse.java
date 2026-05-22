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
    private String departmentCode;
    private String departmentName;
    private UUID majorId;
    private String majorCode;
    private String majorName;
    private UUID specializationId;
    private String specializationCode;
    private String specializationName;
    private UUID advisorId;
    private String advisorCode;
    private String advisorName;
    private UUID academicCohortId;
    private String academicCohortCode;
    private String academicCohortName;
    private String classPhase;
    private Integer maxSize;
    private Integer status;
    private String note;
    private Boolean isActive;
}

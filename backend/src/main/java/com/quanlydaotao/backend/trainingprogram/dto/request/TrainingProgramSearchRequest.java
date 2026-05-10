package com.quanlydaotao.backend.trainingprogram.dto.request;

import lombok.Data;

@Data
public class TrainingProgramSearchRequest {
    private String code;
    private String name;
    private String majorId;
    private String departmentId;
    private String academicCohortId;
    private String degreeLevel;
    private String educationType;
    private Boolean isActive;
}
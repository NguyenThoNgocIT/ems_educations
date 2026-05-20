package com.quanlydaotao.backend.trainingprogramcourse.dto;

import lombok.Data;

import java.math.BigDecimal;
import java.util.UUID;

@Data
public class TrainingProgramCourseResponse {
    private UUID trainingProgramId;
    private UUID courseId;
    private UUID semesterId;
    private Boolean isRequired;
    private String groupCode;
    private BigDecimal credits;
    private UUID prerequisiteCourseId;
    private Boolean isPrerequisiteRequired;
    private String note;
    private Integer sortOrder;
    private String status;
    private String coursePhase;
    private Boolean isActive;
}

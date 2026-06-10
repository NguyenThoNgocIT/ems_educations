package com.quanlydaotao.backend.trainingprogramcourse.dto;

import jakarta.validation.constraints.NotNull;
import lombok.Data;

import java.math.BigDecimal;
import java.util.UUID;

@Data
public class TrainingProgramCourseRequest {
    @NotNull(message = "Chương trình đào tạo không được để trống")
    private UUID trainingProgramId;

    @NotNull(message = "Môn học không được để trống")
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

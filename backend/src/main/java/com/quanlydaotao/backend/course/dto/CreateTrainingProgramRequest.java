package com.quanlydaotao.backend.course.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;
import java.util.UUID;

@Data
public class CreateTrainingProgramRequest {
    @NotBlank(message = "Program code is required")
    private String programCode;
    
    @NotBlank(message = "Program name is required")
    private String programName;
    
    @NotNull(message = "Major ID is required")
    private UUID majorId;
    
    @NotBlank(message = "Academic year is required")
    private String academicYear;
    
    @NotNull(message = "Academic cohort ID is required")
    private UUID academicCohortId;
    
    @NotNull(message = "Total credits is required")
    private Integer totalCredits;
    
    private String description;
    private String note;
}

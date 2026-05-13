package com.quanlydaotao.backend.course.dto;

import lombok.Data;
import java.util.UUID;

@Data
public class TrainingProgramDto {
    private UUID programId;
    private String programCode;
    private String programName;
    private UUID majorId;
    private String academicYear;
    private Integer totalCredits;
    private String description;
    private Integer status;
}

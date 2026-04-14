package com.quanlydaotao.backend.trainingprogram;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import java.util.UUID;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class TrainingProgramRequest {

    @NotBlank
    private String programCode;

    @NotBlank
    private String programName;

    @NotNull
    private UUID majorId;

    @NotBlank
    private String academicYear;

    @NotNull
    private Integer totalCredits;

    private String description;

    @NotNull
    private Boolean status;

    private String note;
}

package com.quanlydaotao.backend.gradescale;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class GradeScaleRequest {

    @NotBlank
    private String scaleName;

    @NotNull
    private Double minScore;

    @NotNull
    private Double maxScore;

    @NotBlank
    private String gradeLetter;

    @NotNull
    private Double gpaValue;

    private String description;
}

package com.quanlydaotao.backend.graduationcouncil;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import java.time.LocalDate;
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
public class GraduationCouncilRequest {

    @NotBlank
    private String councilCode;

    @NotBlank
    private String councilName;

    @NotBlank
    private String schoolYear;

    @NotBlank
    private String semester;

    @NotBlank
    private String decisionNumber;

    @NotNull
    private LocalDate decisionDate;

    private String description;

    @NotNull
    private LocalDate startDate;

    @NotNull
    private LocalDate endDate;
}

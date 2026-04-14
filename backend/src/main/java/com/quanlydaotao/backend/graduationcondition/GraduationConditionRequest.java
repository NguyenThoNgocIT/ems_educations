package com.quanlydaotao.backend.graduationcondition;

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
public class GraduationConditionRequest {

    @NotBlank
    private String conditionCode;

    @NotBlank
    private String conditionName;

    @NotNull
    private Integer minCredits;

    @NotNull
    private Double minGpa;

    @NotNull
    private Integer maxFailedCourses;

    private String requiredCertificate;

    private String description;

    @NotNull
    private LocalDate startDate;

    @NotNull
    private LocalDate dueDate;
}

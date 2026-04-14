package com.quanlydaotao.backend.graduationresult;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import java.time.LocalDate;
import java.util.UUID;
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
public class GraduationResultRequest {

    @NotNull
    private UUID studentId;

    @NotNull
    private UUID conditionId;

    @NotNull
    private Integer totalCredits;

    @NotNull
    private Double gpa;

    @NotNull
    private Integer failedCourses;

    @NotBlank
    private String graduationStatus;

    private String graduationRank;

    private String decisionNumber;

    private LocalDate decisionDate;

    private LocalDate startDate;

    private LocalDate dueDate;
}

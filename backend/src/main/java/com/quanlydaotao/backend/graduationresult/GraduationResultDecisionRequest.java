package com.quanlydaotao.backend.graduationresult;

import jakarta.validation.constraints.NotBlank;
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
public class GraduationResultDecisionRequest {

    @NotBlank
    private String decisionNumber;

    private LocalDate decisionDate;

    private LocalDate startDate;

    private LocalDate dueDate;

    private String graduationRank;
}

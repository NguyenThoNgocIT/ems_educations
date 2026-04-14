package com.quanlydaotao.backend.semester;

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
public class SemesterRequest {

    @NotBlank
    private String code;

    @NotBlank
    private String name;

    @NotBlank
    private String academicYear;

    @NotNull
    private LocalDate startDate;

    @NotNull
    private LocalDate endDate;

    private String description;
}

package com.quanlydaotao.backend.graduationsession;

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
public class GraduationSessionRequest {

    @NotBlank
    private String sessionCode;

    @NotBlank
    private String sessionName;

    @NotBlank
    private String academicYear;

    @NotBlank
    private String semester;

    @NotNull
    private LocalDate startDate;

    @NotNull
    private LocalDate dueDate;

    private String description;
}

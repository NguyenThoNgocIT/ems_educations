package com.quanlydaotao.backend.subject;

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
public class SubjectRequest {

    @NotBlank
    private String courseCode;

    @NotBlank
    private String courseName;

    @NotNull
    private Integer credits;

    @NotNull
    private Integer theoryHours;

    @NotNull
    private Integer practiceHours;

    private String description;

    @NotNull
    private Integer semester;

    @NotNull
    private Boolean isMandatory;

    @NotNull
    private UUID programId;
}

package com.quanlydaotao.backend.graduationprofile;

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
public class GraduationProfileRequest {

    @NotNull
    private UUID studentId;

    @NotNull
    private UUID councilId;

    @NotNull
    private UUID conditionId;

    @NotBlank
    private String profileCode;

    @NotNull
    private LocalDate submissionDate;

    @NotBlank
    private String status;

    private String note;
}

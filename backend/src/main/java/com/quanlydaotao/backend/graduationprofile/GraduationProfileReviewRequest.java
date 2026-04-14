package com.quanlydaotao.backend.graduationprofile;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
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
public class GraduationProfileReviewRequest {

    @NotBlank
    private String status;

    @NotNull
    private UUID reviewerId;

    private String note;
}

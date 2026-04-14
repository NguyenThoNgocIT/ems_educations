package com.quanlydaotao.backend.major;

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
public class MajorRequest {

    @NotBlank
    private String majorCode;

    @NotBlank
    private String majorName;

    private String description;

    @NotNull
    private UUID departmentId;
}

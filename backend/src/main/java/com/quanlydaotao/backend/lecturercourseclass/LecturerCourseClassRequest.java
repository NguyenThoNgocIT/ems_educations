package com.quanlydaotao.backend.lecturercourseclass;

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
public class LecturerCourseClassRequest {

    @NotNull
    private UUID lecturerId;

    @NotNull
    private UUID courseClassId;

    @NotBlank
    private String role;

    private Boolean isActive;
}

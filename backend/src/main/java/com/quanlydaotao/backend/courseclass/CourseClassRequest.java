package com.quanlydaotao.backend.courseclass;

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
public class CourseClassRequest {

    @NotNull
    private UUID courseId;

    @NotNull
    private UUID semesterId;

    @NotBlank
    private String classCode;

    @NotNull
    private Integer maxStudent;

    private String schedule;

    @NotBlank
    private String room;

    @NotNull
    private Integer status;
}

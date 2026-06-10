package com.quanlydaotao.backend.course.dto;

import jakarta.validation.constraints.NotNull;
import lombok.Data;

import java.util.UUID;

@Data
public class AdminAddCourseClassStudentRequest {
    @NotNull(message = "Sinh viên không được để trống")
    private UUID studentId;
    private UUID registrationPeriodId;
    private Integer registrationType;
    private Integer status;
    private Boolean isPaid;
}

package com.quanlydaotao.backend.studentclass.dto;

import jakarta.validation.constraints.NotNull;
import lombok.Data;

import java.util.UUID;

@Data
public class StudentClassRequest {
    @NotNull(message = "Sinh viên không được để trống")
    private UUID studentId;

    @NotNull(message = "Lớp hành chính không được để trống")
    private UUID classId;

    @NotNull(message = "Học kỳ không được để trống")
    private UUID semesterId;

    private String roleInClass;
    private String status;
    private String note;
    private Boolean isActive;
}

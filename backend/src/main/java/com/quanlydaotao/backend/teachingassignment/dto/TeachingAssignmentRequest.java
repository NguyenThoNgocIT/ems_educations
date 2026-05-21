package com.quanlydaotao.backend.teachingassignment.dto;

import jakarta.validation.constraints.NotNull;
import lombok.Data;

import java.util.UUID;

@Data
public class TeachingAssignmentRequest {
    @NotNull(message = "Giảng viên không được để trống")
    private UUID instructorId;
    @NotNull(message = "Lớp học phần không được để trống")
    private UUID courseClassId;
    @NotNull(message = "Lớp hành chính không được để trống")
    private UUID classId;
    @NotNull(message = "Học kỳ không được để trống")
    private UUID semesterId;
    private String note;
    private Boolean isActive;
}

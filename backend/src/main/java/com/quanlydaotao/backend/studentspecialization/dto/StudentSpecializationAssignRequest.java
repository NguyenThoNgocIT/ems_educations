package com.quanlydaotao.backend.studentspecialization.dto;

import jakarta.validation.constraints.NotNull;
import lombok.Data;

import java.time.LocalDate;
import java.util.UUID;

@Data
public class StudentSpecializationAssignRequest {
    @NotNull(message = "Sinh viên không được để trống")
    private UUID studentId;

    @NotNull(message = "Ngành không được để trống")
    private UUID majorId;

    @NotNull(message = "Chuyên ngành không được để trống")
    private UUID specializationId;

    @NotNull(message = "Chương trình đào tạo chuyên ngành không được để trống")
    private UUID trainingProgramId;

    @NotNull(message = "Học kỳ hiệu lực không được để trống")
    private UUID effectiveSemesterId;

    private UUID classId;
    private LocalDate startDate;
    private String reason;
}

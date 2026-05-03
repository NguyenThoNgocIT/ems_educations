package com.quanlydaotao.backend.student.dto;
import lombok.Data;
import java.util.UUID;
@Data
public class UpdateStudentRequest {
    private String note;
    private UUID trainingProgramId;
    private Boolean isActive;
}


package com.quanlydaotao.backend.student.dto;
import lombok.Data;
import java.util.UUID;
@Data
public class CreateStudentRequest {
    private UUID personId;
    private String studentCode;
    private String note;
    private UUID trainingProgramId;
}


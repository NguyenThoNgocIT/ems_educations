package com.quanlydaotao.backend.student.dto;

import lombok.Data;
import java.util.UUID;

@Data
public class UpdateStudentRequest {
    private String fullName;
    private java.time.LocalDate dateOfBirth;
    private String gender;
    private String phoneNumber;
    private String contactEmail;
    private String note;
    private UUID trainingProgramId;
    private Boolean isActive;
    private String phoneNumber;      // ✅ THÊM
    private String contactEmail;     // ✅ THÊM
}
package com.quanlydaotao.backend.student.dto;

import lombok.Data;
import java.time.LocalDate;
import java.util.UUID;

@Data
public class EnrollStudentRequest {
    // Person info
    private String fullName;
    private LocalDate dateOfBirth;
    private String gender;
    private String phoneNumber;
    private String contactEmail;
    
    // Student info
    private String studentCode;
    private UUID trainingProgramId;
    private String note;
}


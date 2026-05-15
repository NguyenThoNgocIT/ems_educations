package com.quanlydaotao.backend.student.dto;
import lombok.Data;
import java.util.UUID;
import java.time.LocalDateTime;
@Data
public class StudentDto {
    private UUID id;
    private UUID personId;
    private String fullName;
    private java.time.LocalDate dateOfBirth;
    private String gender;
    private String phoneNumber;
    private String contactEmail;
    private String studentCode;
    private String note;
    private UUID trainingProgramId;
    private Boolean isActive;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}


package com.quanlydaotao.backend.student.dto;

import lombok.Data;
import java.time.LocalDateTime;
import java.util.UUID;

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
    private String phoneNumber;      // ✅ THÊM NẾU CẦN HIỂN THỊ
    private String contactEmail;     // ✅ THÊM NẾU CẦN HIỂN THỊ
}
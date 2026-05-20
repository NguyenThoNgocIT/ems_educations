package com.quanlydaotao.backend.student.dto;

import lombok.Data;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.UUID;

@Data
public class StudentAdminResponse {
    private UUID studentId;
    private UUID personId;
    private String studentCode;
    private UUID departmentId;
    private UUID majorId;
    private UUID specializationId;
    private UUID trainingProgramId;
    private UUID academicCohortId;
    private UUID classId;
    private LocalDate admissionDate;
    private String note;
    private Boolean isActive;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;

    private String fullName;
    private String fullNameNoAccent;
    private String gender;
    private LocalDate dateOfBirth;
    private String placeOfBirth;
    private String ethnicity;
    private String personalIdentificationNumber;
    private LocalDate dateOfIssue;
    private String cardPlace;
    private String nationality;
    private String contactEmail;
    private String phoneNumber;
    private String permanentAddress;
    private String temporaryAddress;
    private String avatarUrl;
}

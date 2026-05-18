package com.quanlydaotao.backend.student.dto;

import lombok.Data;

import java.time.LocalDate;
import java.util.UUID;

@Data
public class StudentAdminUpdateRequest {
    private String studentCode;
    private UUID majorId;
    private UUID trainingProgramId;
    private UUID academicCohortId;
    private UUID classId;
    private LocalDate admissionDate;
    private String note;
    private Boolean isActive;

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

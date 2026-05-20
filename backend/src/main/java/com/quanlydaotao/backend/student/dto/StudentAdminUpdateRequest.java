package com.quanlydaotao.backend.student.dto;

import lombok.Data;

import java.time.LocalDate;
import java.util.UUID;

@Data
public class StudentAdminUpdateRequest {
    private String studentCode;
    private UUID departmentId;
    private UUID majorId;
    private UUID specializationId;
    private UUID trainingProgramId;
    private UUID academicCohortId;
    private UUID classId;
    private UUID semesterId;
    private LocalDate admissionDate;
    private UUID studentStatusId;
    private LocalDate studentStatusStartDate;
    private String studentStatusReason;
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

package com.quanlydaotao.backend.instructor.dto;

import lombok.Data;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.UUID;

@Data
public class InstructorAdminResponse {
    private UUID employeeId;
    private String employeeCode;
    private String instructorCode;
    private LocalDate startWorkDate;
    private LocalDate endWorkDate;
    private String employeeStatus;
    private String employeeType;
    private String contractType;
    private String note;
    private UUID departmentId;
    private UUID degreeId;
    private String academicRank;
    private UUID majorId;
    private String specialization;
    private String institution;
    private Integer graduationYear;
    private Boolean isActive;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;

    private UUID personId;
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

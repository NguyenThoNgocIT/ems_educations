package com.quanlydaotao.backend.staff.dto;

import lombok.Data;

import java.time.LocalDate;
import java.util.UUID;

@Data
public class StaffSelfResponse {
    private UUID employeeId;
    private String employeeCode;
    private String staffCode;
    private LocalDate startWorkDate;
    private String employeeStatus;
    private String contractType;
    private UUID divisionId;
    private UUID positionId;

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

package com.quanlydaotao.backend.student.dto;

import lombok.Data;

import java.time.LocalDate;

@Data
public class StudentSelfUpdateRequest {
    private String fullName;
    private String gender;
    private LocalDate dateOfBirth;
    private String placeOfBirth;
    private String ethnicity;
    private LocalDate dateOfIssue;
    private String cardPlace;
    private String nationality;
    private String contactEmail;
    private String phoneNumber;
    private String permanentAddress;
    private String temporaryAddress;
    private String avatarUrl;
}

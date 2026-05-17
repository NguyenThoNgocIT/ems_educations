package com.quanlydaotao.backend.instructor.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

import java.time.LocalDate;
import java.util.UUID;

@Data
public class InstructorAdminCreateRequest {
    @NotBlank(message = "Họ tên không được để trống")
    private String fullName;
    private String fullNameNoAccent;
    @NotNull(message = "Ngày sinh không được để trống")
    private LocalDate dateOfBirth;
    private String gender;
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
    private String note;

    private String employeeCode;
    private String instructorCode;
    private LocalDate startWorkDate;
    private LocalDate endWorkDate;
    private String contractType;
    @NotNull(message = "Khoa/Bộ môn không được để trống")
    private UUID departmentId;
    private UUID degreeId;
    private String academicRank;
    private UUID majorId;
    private String specialization;
    private String institution;
    private Integer graduationYear;
}

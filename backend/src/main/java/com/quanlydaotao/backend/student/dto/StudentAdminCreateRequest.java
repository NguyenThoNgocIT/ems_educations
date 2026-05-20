package com.quanlydaotao.backend.student.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

import java.time.LocalDate;
import java.util.UUID;

@Data
public class StudentAdminCreateRequest {
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

    private String studentCode;
    @NotNull(message = "Khoa không được để trống")
    private UUID departmentId;
    private UUID majorId;
    private UUID specializationId;
    private UUID trainingProgramId;
    @NotNull(message = "Khóa học không được để trống")
    private UUID academicCohortId;
    private UUID classId;
    private UUID semesterId;
    private LocalDate admissionDate;
    private UUID studentStatusId;
    private LocalDate studentStatusStartDate;
    private String studentStatusReason;
}

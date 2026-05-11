package com.quanlydaotao.backend.user.dto.response;

import lombok.Getter;
import lombok.Setter;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.UUID;

@Getter
@Setter
public class PersonDetailResponse {

    private UUID personId;

    private String fullName;

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

    private String note;

    private Boolean isActive;

    /*
     * Audit Fields
     */
    private LocalDateTime createdAt;

    private UUID createdBy;

    private LocalDateTime updatedAt;

    private UUID updatedBy;

    private LocalDateTime deletedAt;

    private UUID deletedBy;
}
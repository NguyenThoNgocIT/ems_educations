package com.quanlydaotao.backend.user.dto;
import lombok.Data;
import java.time.LocalDate;
@Data public class UpdatePersonRequest { private String fullName; private String gender; private LocalDate dateOfBirth; private String placeOfBirth; private String ethnicity; private String personalIdentificationNumber; private LocalDate dateOfIssue; private String cardPlace; private String nationality; private String contactEmail; private String phoneNumber; private String permanentAddress; private String temporaryAddress; private String avatarUrl; private String note; }
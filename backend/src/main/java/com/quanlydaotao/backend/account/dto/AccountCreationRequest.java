package com.quanlydaotao.backend.account.dto;
import lombok.Data;
import java.time.LocalDate;
import java.util.UUID;
@Data
public class AccountCreationRequest {
    private String fullName;
    private String fullNameNonAccent;
    private LocalDate dateOfBirth;
    private String gender;
    private String contactEmail;
    private String phoneNumber;
    private String personalIdentificationNumber;
    private String type; // STUDENT, INSTRUCTOR, STAFF
    // For Student
    private String studentCode;
    private UUID trainingProgramId;
    // For Employee/Instructor
    private LocalDate startWorkDate;
    private String employeeCode;
    private UUID departmentId;
    private UUID degreeId;
    // Staff specific
    private UUID divisionId;
    private UUID positionId;
}

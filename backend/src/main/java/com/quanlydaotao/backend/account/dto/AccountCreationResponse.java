package com.quanlydaotao.backend.account.dto;

import lombok.Builder;
import lombok.Data;

import java.util.UUID;

@Data
@Builder
public class AccountCreationResponse {
    private UUID personId;
    private UUID studentId;
    private UUID employeeId;
    private UUID userId;
    private String type;
    private String roleCode;
    private String generatedCode;
    private String studentCode;
    private String employeeCode;
    private String instructorCode;
    private String staffCode;
    private String username;
    private String emailEdu;
    private String initialPassword;
    private String confirmationToken;
    private String confirmationLink;
    private Boolean requirePasswordChange;

    private UUID majorId;
    private UUID trainingProgramId;
    private UUID academicCohortId;
    private UUID classId;
    private UUID semesterId;
    private UUID studentClassId;
    private UUID studentStatusId;
    private UUID studentStatusHistoryId;
    private UUID departmentId;
    private UUID degreeId;
    private UUID divisionId;
    private UUID positionId;
}

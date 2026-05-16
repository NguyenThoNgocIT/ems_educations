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
    private String username;
    private String emailEdu;
    private String initialPassword;
    private Boolean requirePasswordChange;
}

package com.quanlydaotao.backend.student.dto;

import com.quanlydaotao.backend.account.dto.AccountCreationResponse;
import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class StudentImportRowResultResponse {
    private Integer rowNumber;
    private Boolean success;
    private String fullName;
    private String studentCode;
    private String username;
    private String emailEdu;
    private String message;
    private AccountCreationResponse account;
}

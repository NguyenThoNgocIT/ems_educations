package com.quanlydaotao.backend.auth.dto;

import lombok.Data;

@Data
public class ForgotPasswordRequest {
    private String requesterCode;
    private String emailEdu;
    private String phoneNumber;
    private String fullName;
}

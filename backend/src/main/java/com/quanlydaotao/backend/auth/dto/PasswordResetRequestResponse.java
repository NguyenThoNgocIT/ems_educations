package com.quanlydaotao.backend.auth.dto;

import lombok.Data;

import java.time.LocalDateTime;
import java.util.UUID;

@Data
public class PasswordResetRequestResponse {
    private UUID passwordResetRequestId;
    private UUID userId;
    private String username;
    private String requesterCode;
    private String emailEdu;
    private String phoneNumber;
    private String fullName;
    private String status;
    private String adminNote;
    private LocalDateTime processedAt;
    private LocalDateTime createdAt;
}

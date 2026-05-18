package com.quanlydaotao.backend.user.dto;

import lombok.Data;

import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

@Data
public class UserAdminResponse {
    private UUID userId;
    private UUID personId;
    private String username;
    private String email;
    private LocalDateTime lastLoginAt;
    private Integer accessFailedCount;
    private LocalDateTime lockoutEndAt;
    private String lockReason;
    private Boolean requirePasswordChange;
    private Boolean emailConfirmed;
    private String confirmationToken;
    private Boolean isActive;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
    private LocalDateTime deletedAt;
    private List<String> roles;
}

package com.quanlydaotao.backend.user.dto;

import lombok.Data;

import java.time.LocalDateTime;

@Data
public class UpdateUserAdminRequest {
    private Boolean isActive;
    private Boolean requirePasswordChange;
    private Boolean emailConfirmed;
    private String confirmationToken;
    private Integer accessFailedCount;
    private LocalDateTime lockoutEndAt;
    private String lockReason;
}

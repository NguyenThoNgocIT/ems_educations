package com.quanlydaotao.backend.auth.dto;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class AdminResetPasswordResponse {
    private String username;
    private String emailEdu;
    private String defaultPassword;
    private String confirmationToken;
    private String confirmationLink;
    private Boolean requirePasswordChange;
}

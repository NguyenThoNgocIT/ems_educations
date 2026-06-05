package com.quanlydaotao.backend.auth.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;
import java.util.UUID;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class LoginResponse {
    private String accessToken;
    private String refreshToken;
    @Builder.Default
    private String tokenType = "Bearer";
    private String username;
    private UUID employeeId;
    private String fullName;
    private String avatarUrl;
    private List<String> roles;
    private List<String> permissions;
    private boolean requirePasswordChange;
}

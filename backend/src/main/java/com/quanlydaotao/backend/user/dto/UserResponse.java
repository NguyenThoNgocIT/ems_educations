package com.quanlydaotao.backend.user.dto;

import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

@Data
@NoArgsConstructor
public class UserResponse {
    private UUID userId;
    private String fullName;
    private String username;
    private String email;
    private String phoneNumber;
    private String status; // "Active", "Locked", "Inactive"
    private LocalDateTime lastLogin;
    private List<String> roles;
}

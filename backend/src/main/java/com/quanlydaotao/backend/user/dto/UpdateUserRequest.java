package com.quanlydaotao.backend.user.dto;

import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
public class UpdateUserRequest {
    private String fullName;
    private String email;
    private String phoneNumber;
    private String role; // role code
}

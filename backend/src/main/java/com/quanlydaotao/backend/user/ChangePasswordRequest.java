package com.quanlydaotao.backend.user;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.Builder;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@Builder
public class ChangePasswordRequest {

    @NotBlank
    @Size(max = 255)
    private String currentPassword;

    @NotBlank
    @Size(max = 255)
    private String newPassword;

    @NotBlank
    @Size(max = 255)
    private String confirmationPassword;
}

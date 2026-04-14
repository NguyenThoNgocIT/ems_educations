package com.quanlydaotao.backend.auth;

import com.quanlydaotao.backend.user.Role;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class RegisterRequest {

  @NotBlank
  @Size(max = 255)
  private String firstname;

  @NotBlank
  @Size(max = 255)
  private String lastname;

  @Email
  @NotBlank
  @Size(max = 255)
  private String email;

  @NotBlank
  @Size(max = 255)
  private String password;
}

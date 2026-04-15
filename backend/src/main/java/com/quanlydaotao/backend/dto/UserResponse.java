package com.quanlydaotao.backend.dto;

import com.quanlydaotao.backend.user.Role;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class UserResponse {

  private Integer id;

  private String firstname;

  private String lastname;

  private String email;

  private Role role;

  private Boolean locked;

  // 👉 nếu sau này cần hiển thị avatar thì dùng Base64
  private String avatar;
}
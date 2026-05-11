package com.quanlydaotao.backend.auth.dto;
import lombok.Data;
@Data public class ChangePasswordRequest { private String oldPassword; private String newPassword; }
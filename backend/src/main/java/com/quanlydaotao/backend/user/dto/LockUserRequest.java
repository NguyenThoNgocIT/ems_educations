package com.quanlydaotao.backend.user.dto;
import lombok.Data;
@Data public class LockUserRequest { private String lockReason; private Integer lockoutDays; }
package com.quanlydaotao.backend.user.dto;
import lombok.Data;
@Data public class LockUserAdminRequest { private String lockReason; private Integer lockoutDays; }
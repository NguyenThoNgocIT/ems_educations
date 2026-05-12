package com.quanlydaotao.backend.user.dto;
import lombok.Data;
import java.util.UUID;
import java.time.LocalDateTime;
@Data public class UserDto { private UUID userId; private UUID personId; private String username; private String email; private LocalDateTime lastLoginAt; private Integer accessFailedCount; private LocalDateTime lockoutEndAt; private String lockReason; private Boolean requirePasswordChange; private Boolean isActive; private LocalDateTime deletedAt; }
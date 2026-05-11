package com.quanlydaotao.backend.user.dto;
import lombok.Data;
import java.util.UUID;
@Data public class CreateUserRequest { private UUID personId; private String username; private String email; }
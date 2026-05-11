package com.quanlydaotao.backend.auth.dto;
import lombok.Builder;
import lombok.Data;
import java.util.List;
@Data @Builder public class AuthMeResponse { private String username; private String email; private String fullName; private List<String> roles; private boolean requirePasswordChange; }
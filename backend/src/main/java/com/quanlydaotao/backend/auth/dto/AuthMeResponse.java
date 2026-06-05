package com.quanlydaotao.backend.auth.dto;
import lombok.Builder;
import lombok.Data;
import java.util.List;
import java.util.UUID;
@Data @Builder public class AuthMeResponse { 
    private String username; 
    private UUID employeeId;
    private String email; 
    private String fullName; 
    private String avatarUrl;
    private List<String> roles; 
    private List<String> permissions;
    private boolean requirePasswordChange; }

package com.quanlydaotao.backend.auth.service;

import com.quanlydaotao.backend.auth.dto.LoginRequest;
import com.quanlydaotao.backend.auth.dto.LoginResponse;
import com.quanlydaotao.backend.auth.dto.ChangePasswordRequest;
import com.quanlydaotao.backend.auth.dto.AuthMeResponse;
import com.quanlydaotao.backend.infrastructure.security.jwt.JwtTokenProvider;
import com.quanlydaotao.backend.user.entity.User;
import com.quanlydaotao.backend.user.entity.UserSession;
import com.quanlydaotao.backend.user.repository.UserRepository;
import com.quanlydaotao.backend.user.repository.UserSessionRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.nio.charset.StandardCharsets;
import java.security.MessageDigest;
import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class AuthService {

    private final AuthenticationManager authenticationManager;
    private final JwtTokenProvider tokenProvider;
    private final UserRepository userRepository;
    private final UserSessionRepository userSessionRepository;
    private final PasswordEncoder passwordEncoder;

    @Transactional
    public LoginResponse authenticateUser(LoginRequest loginRequest) {
        Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(loginRequest.getUsername(), loginRequest.getPassword())
        );

        SecurityContextHolder.getContext().setAuthentication(authentication);

        String jwt = tokenProvider.generateToken(authentication);
        String refreshToken = UUID.randomUUID().toString(); // Mock refresh token generation

        User user = userRepository.findByUsername(loginRequest.getUsername()).orElseThrow();
        String fullName = user.getPerson().getFullName();

        // Update last login
        user.setLastLoginAt(LocalDateTime.now());
        userRepository.save(user);

        // Save session
        UserSession session = new UserSession();
        session.setUser(user);
        
        try {
            MessageDigest digest = MessageDigest.getInstance("SHA-256");
            byte[] hash = digest.digest(refreshToken.getBytes(StandardCharsets.UTF_8));
            session.setRefreshTokenHash(hash);
        } catch (Exception e) {
            throw new RuntimeException("Lỗi tạo hash cho refresh token", e);
        }
        
        session.setExpiresAt(LocalDateTime.now().plusDays(7));
        userSessionRepository.save(session);

        List<String> roles = authentication.getAuthorities().stream()
                .map(item -> item.getAuthority())
                .collect(Collectors.toList());

        boolean requirePassChange = user.getRequirePasswordChange() != null && user.getRequirePasswordChange();
        // Cố tình bỏ qua yêu cầu đổi mật khẩu đối với tài khoản admin
        if ("admin".equalsIgnoreCase(user.getUsername())) {
             requirePassChange = false;
        }

        return LoginResponse.builder()
                .accessToken(jwt)
                .refreshToken(refreshToken)
                .username(user.getUsername())
                .fullName(fullName)
                .roles(roles)
                .requirePasswordChange(requirePassChange)
                .build();
    }

    @Transactional
    public void changePassword(String currentUsername, ChangePasswordRequest request) {
        User user = userRepository.findByUsername(currentUsername).orElseThrow();
        if (!passwordEncoder.matches(request.getOldPassword(), user.getPasswordHash())) {
            throw new BadCredentialsException("Sai mật khẩu cũ");
        }
        user.setPasswordHash(passwordEncoder.encode(request.getNewPassword()));
        user.setRequirePasswordChange(false);
        userRepository.save(user);
    }

    @Transactional(readOnly = true)
    public AuthMeResponse getMe(String username) {
        User user = userRepository.findByUsername(username).orElseThrow();
        return AuthMeResponse.builder()
                .username(user.getUsername())
                .email(user.getEmail())
                .fullName(user.getPerson().getFullName())
                .requirePasswordChange(user.getRequirePasswordChange() != null && user.getRequirePasswordChange())
                .build();
    }

    @Transactional
    public void logout(String username) {
        User user = userRepository.findByUsername(username).orElseThrow();
        // Delete all sessions or explicit token based (Mocking logout for now by revoking all)
        List<UserSession> sessions = userSessionRepository.findAllByUser_UserId(user.getUserId());
        sessions.forEach(s -> s.setRevokedAt(LocalDateTime.now()));
        userSessionRepository.saveAll(sessions);
    }
}
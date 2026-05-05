package com.quanlydaotao.backend.auth.service;

import com.quanlydaotao.backend.auth.dto.LoginRequest;
import com.quanlydaotao.backend.auth.dto.LoginResponse;
import com.quanlydaotao.backend.infrastructure.security.jwt.JwtTokenProvider;
import com.quanlydaotao.backend.user.entity.User;
import com.quanlydaotao.backend.user.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class AuthService {

    private final AuthenticationManager authenticationManager;
    private final JwtTokenProvider tokenProvider;
    private final UserRepository userRepository;

    @Transactional(readOnly = true)
    public LoginResponse authenticateUser(LoginRequest loginRequest) {
        Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(loginRequest.getUsername(), loginRequest.getPassword())
        );

        SecurityContextHolder.getContext().setAuthentication(authentication);

        String jwt = tokenProvider.generateToken(authentication);

        User user = userRepository.findByUsername(loginRequest.getUsername()).orElseThrow();
        String fullName = user.getPerson().getFullName();

        List<String> roles = authentication.getAuthorities().stream()
                .map(item -> item.getAuthority())
                .collect(Collectors.toList());

        return LoginResponse.builder()
                .accessToken(jwt)
                .username(user.getUsername())
                .fullName(fullName)
                .roles(roles)
                .build();
    }
}

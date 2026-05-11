package com.quanlydaotao.backend.auth.service;

import com.quanlydaotao.backend.auth.dto.LoginRequest;
import com.quanlydaotao.backend.auth.dto.LoginResponse;
import com.quanlydaotao.backend.auth.dto.ChangePasswordRequest;
import com.quanlydaotao.backend.auth.dto.AuthMeResponse;
import com.quanlydaotao.backend.auth.dto.RegisterRequest;
import com.quanlydaotao.backend.infrastructure.security.jwt.JwtTokenProvider;
import com.quanlydaotao.backend.role.entity.Role;
import com.quanlydaotao.backend.role.repository.RoleRepository;
import com.quanlydaotao.backend.user.entity.Person;
import com.quanlydaotao.backend.user.entity.User;
import com.quanlydaotao.backend.user.entity.UserRole;
import com.quanlydaotao.backend.user.entity.UserRoleId;
import com.quanlydaotao.backend.user.entity.UserSession;
import com.quanlydaotao.backend.user.repository.PersonRepository;
import com.quanlydaotao.backend.user.repository.UserRepository;
import com.quanlydaotao.backend.user.repository.UserRoleRepository;
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
    private final PersonRepository personRepository;
    private final RoleRepository roleRepository;
    private final UserRoleRepository userRoleRepository;

    @Transactional
    public LoginResponse authenticateUser(LoginRequest loginRequest) {
        Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(loginRequest.getUsername(), loginRequest.getPassword())
        );

        SecurityContextHolder.getContext().setAuthentication(authentication);

        String jwt = tokenProvider.generateToken(authentication);
        String refreshToken = UUID.randomUUID().toString();

        User user = userRepository.findByUsername(loginRequest.getUsername()).orElseThrow();
        String fullName = user.getPerson().getFullName();

        user.setLastLoginAt(LocalDateTime.now());
        userRepository.save(user);

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
    public LoginResponse register(RegisterRequest request) {
        // 1. Kiểm tra username đã tồn tại
        if (userRepository.existsByUsername(request.getUsername())) {
            throw new RuntimeException("Tên đăng nhập đã tồn tại");
        }
        
        // 2. Kiểm tra email đã tồn tại
        if (userRepository.existsByEmail(request.getEmail())) {
            throw new RuntimeException("Email đã được sử dụng");
        }
        
        // 3. Tạo Person mới
        Person person = new Person();
        person.setFullName(request.getFullName());
        person.setContactEmail(request.getEmail());
        person.setPhoneNumber(request.getPhoneNumber());
        person.setIsActive(true);
        person = personRepository.save(person);
        
        // 4. Tạo User với password đã mã hóa
        User user = new User();
        user.setUsername(request.getUsername());
        user.setPasswordHash(passwordEncoder.encode(request.getPassword()));
        user.setPerson(person);
        user.setEmail(request.getEmail());
        user.setIsActive(true);
        user.setRequirePasswordChange(false);
        user = userRepository.save(user);
        
        // 5. Gán role mặc định (USER)
        Role defaultRole = roleRepository.findByCode("USER")
            .orElseThrow(() -> new RuntimeException("Role mặc định không tồn tại"));
        
        UserRole userRole = new UserRole();
        userRole.setId(new UserRoleId(user.getUserId(), defaultRole.getRoleId()));
        userRole.setUser(user);
        userRole.setRole(defaultRole);
        userRole.setIsActive(true);
        userRoleRepository.save(userRole);
        
        // 6. Tạo token và trả về
        Authentication authentication = authenticationManager.authenticate(
            new UsernamePasswordAuthenticationToken(request.getUsername(), request.getPassword())
        );
        
        String jwt = tokenProvider.generateToken(authentication);
        String refreshToken = UUID.randomUUID().toString();
        
        // 7. Lưu session
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
        
        // 8. Lấy roles
        List<String> roles = authentication.getAuthorities().stream()
                .map(item -> item.getAuthority())
                .collect(Collectors.toList());
        
        return LoginResponse.builder()
                .accessToken(jwt)
                .refreshToken(refreshToken)
                .username(user.getUsername())
                .fullName(person.getFullName())
                .roles(roles)
                .requirePasswordChange(false)
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
        List<UserSession> sessions = userSessionRepository.findAllByUser_UserId(user.getUserId());
        sessions.forEach(s -> s.setRevokedAt(LocalDateTime.now()));
        userSessionRepository.saveAll(sessions);
    }
}
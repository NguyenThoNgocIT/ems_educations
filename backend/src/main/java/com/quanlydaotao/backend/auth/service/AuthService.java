package com.quanlydaotao.backend.auth.service;

import com.quanlydaotao.backend.auth.dto.AdminResetPasswordResponse;
import com.quanlydaotao.backend.auth.dto.AuthMeResponse;
import com.quanlydaotao.backend.auth.dto.ChangePasswordRequest;
import com.quanlydaotao.backend.auth.dto.ForgotPasswordRequest;
import com.quanlydaotao.backend.auth.dto.LoginRequest;
import com.quanlydaotao.backend.auth.dto.LoginResponse;
import com.quanlydaotao.backend.auth.dto.PasswordResetRequestResponse;
import com.quanlydaotao.backend.auth.dto.ResetPasswordRequest;
import com.quanlydaotao.backend.auth.dto.SetPasswordByTokenRequest;
import com.quanlydaotao.backend.auth.entity.PasswordResetRequest;
import com.quanlydaotao.backend.auth.repository.PasswordResetRequestRepository;
import com.quanlydaotao.backend.common.exception.BusinessException;
import com.quanlydaotao.backend.common.exception.ResourceNotFoundException;
import com.quanlydaotao.backend.employee.entity.Employee;
import com.quanlydaotao.backend.employee.repository.EmployeeRepository;
import com.quanlydaotao.backend.infrastructure.security.jwt.JwtTokenProvider;
import com.quanlydaotao.backend.instructor.repository.InstructorProfileRepository;
import com.quanlydaotao.backend.notification.service.EmailNotificationService;
import com.quanlydaotao.backend.role.repository.RolePermissionRepository;
import com.quanlydaotao.backend.staff.repository.StaffRepository;
import com.quanlydaotao.backend.student.repository.StudentRepository;
import com.quanlydaotao.backend.user.entity.User;
import com.quanlydaotao.backend.user.entity.UserRole;
import com.quanlydaotao.backend.user.entity.UserSession;
import com.quanlydaotao.backend.user.repository.UserRepository;
import com.quanlydaotao.backend.user.repository.UserRoleRepository;
import com.quanlydaotao.backend.user.repository.UserSessionRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.ObjectProvider;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.util.StringUtils;

import java.nio.charset.StandardCharsets;
import java.security.MessageDigest;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.List;
import java.util.Locale;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class AuthService {
    private static final DateTimeFormatter DEFAULT_PASSWORD_FORMAT = DateTimeFormatter.ofPattern("ddMMyyyy");

    private final AuthenticationManager authenticationManager;
    private final JwtTokenProvider tokenProvider;
    private final UserRepository userRepository;
    private final UserSessionRepository userSessionRepository;
    private final UserRoleRepository userRoleRepository;
    private final StudentRepository studentRepository;
    private final EmployeeRepository employeeRepository;
    private final InstructorProfileRepository instructorProfileRepository;
    private final StaffRepository staffRepository;
    private final PasswordResetRequestRepository passwordResetRequestRepository;
    private final PasswordEncoder passwordEncoder;
    private final ObjectProvider<EmailNotificationService> emailNotificationServiceProvider;
    private final RolePermissionRepository rolePermissionRepository;

    @Value("${app.auth.password-change-url:http://localhost:3000/change-password}")
    private String passwordChangeUrl;

    @Transactional
    public LoginResponse authenticateUser(LoginRequest loginRequest) {
        Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(loginRequest.getUsername(), loginRequest.getPassword())
        );

        SecurityContextHolder.getContext().setAuthentication(authentication);

        String jwt = tokenProvider.generateToken(authentication);
        String refreshToken = UUID.randomUUID().toString();

        User user = userRepository.findByUsername(loginRequest.getUsername()).orElseThrow();
        String fullName = user.getPerson() != null ? user.getPerson().getFullName() : user.getUsername();

        user.setLastLoginAt(LocalDateTime.now());
        userRepository.save(user);

        UserSession session = new UserSession();
        session.setUser(user);
        try {
            MessageDigest digest = MessageDigest.getInstance("SHA-256");
            session.setRefreshTokenHash(digest.digest(refreshToken.getBytes(StandardCharsets.UTF_8)));
        } catch (Exception e) {
            throw new RuntimeException("Lỗi tạo hash cho refresh token", e);
        }
        session.setExpiresAt(LocalDateTime.now().plusDays(7));
        userSessionRepository.save(session);

        List<String> roles = findRoleCodes(user.getUserId());

        boolean requirePassChange = user.getRequirePasswordChange() != null && user.getRequirePasswordChange();
        if ("admin".equalsIgnoreCase(user.getUsername()) || "superadmin".equalsIgnoreCase(user.getUsername())) {
            requirePassChange = false;
        }

        return LoginResponse.builder()
                .accessToken(jwt)
                .refreshToken(refreshToken)
                .tokenType("Bearer")
                .username(user.getUsername())
                .employeeId(resolveEmployeeId(user))
                .fullName(fullName)
                .avatarUrl(user.getPerson() != null ? user.getPerson().getAvatarUrl() : null)
                .roles(roles)
                .permissions(rolePermissionRepository.findActivePermissionCodesByUserId(user.getUserId()))
                .requirePasswordChange(requirePassChange)
                .build();
    }

    @Transactional
    public void changePassword(String currentUsername, ChangePasswordRequest request) {
        User user = userRepository.findByUsername(currentUsername)
                .orElseThrow(() -> new ResourceNotFoundException("Không tìm thấy tài khoản"));
        if (!StringUtils.hasText(request.getNewPassword())) {
            throw new BusinessException("Mật khẩu mới không được để trống");
        }
        if (!passwordEncoder.matches(request.getOldPassword(), user.getPasswordHash())) {
            throw new BadCredentialsException("Sai mật khẩu cũ");
        }
        user.setPasswordHash(passwordEncoder.encode(request.getNewPassword()));
        user.setRequirePasswordChange(false);
        user.setEmailConfirmed(true);
        user.setConfirmationToken(null);
        userRepository.save(user);
    }

    @Transactional
    public void setPasswordByToken(SetPasswordByTokenRequest request) {
        if (!StringUtils.hasText(request.getToken())) {
            throw new BusinessException("Token không hợp lệ");
        }
        if (!StringUtils.hasText(request.getNewPassword())) {
            throw new BusinessException("Mật khẩu mới không được để trống");
        }

        User user = userRepository.findByConfirmationToken(request.getToken())
                .orElseThrow(() -> new ResourceNotFoundException("Token đổi mật khẩu không tồn tại"));
        user.setPasswordHash(passwordEncoder.encode(request.getNewPassword()));
        user.setRequirePasswordChange(false);
        user.setEmailConfirmed(true);
        user.setAccessFailedCount(0);
        user.setLockoutEndAt(null);
        user.setLockReason(null);
        user.setConfirmationToken(null);
        userRepository.save(user);
    }

    @Transactional(readOnly = true)
    public AuthMeResponse getMe(String username) {
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new ResourceNotFoundException("Không tìm thấy tài khoản"));

        boolean requirePassChange = user.getRequirePasswordChange() != null && user.getRequirePasswordChange();
        if ("admin".equalsIgnoreCase(user.getUsername()) || "superadmin".equalsIgnoreCase(user.getUsername())) {
            requirePassChange = false;
        }

        return AuthMeResponse.builder()
                .username(user.getUsername())
                .employeeId(resolveEmployeeId(user))
                .email(user.getEmail())
                .fullName(user.getPerson() != null ? user.getPerson().getFullName() : user.getUsername())
                .avatarUrl(user.getPerson() != null ? user.getPerson().getAvatarUrl() : null)
                .roles(findRoleCodes(user.getUserId()))
                .permissions(rolePermissionRepository.findActivePermissionCodesByUserId(user.getUserId()))
                .requirePasswordChange(requirePassChange)
                .build();
    }

    @Transactional
    public PasswordResetRequestResponse createPasswordResetRequest(ForgotPasswordRequest request) {
        validateForgotPasswordRequest(request);
        User user = userRepository.findByEmail(request.getEmailEdu().trim().toLowerCase(Locale.ROOT))
                .orElseThrow(() -> new ResourceNotFoundException("Không tìm thấy tài khoản theo email edu"));
        if (!matchesIdentity(user, request)) {
            throw new BusinessException("Thông tin xác minh không khớp với tài khoản");
        }

        PasswordResetRequest resetRequest = new PasswordResetRequest();
        resetRequest.setUser(user);
        resetRequest.setRequesterCode(request.getRequesterCode().trim().toUpperCase(Locale.ROOT));
        resetRequest.setEmailEdu(request.getEmailEdu().trim().toLowerCase(Locale.ROOT));
        resetRequest.setPhoneNumber(request.getPhoneNumber().trim());
        resetRequest.setFullName(request.getFullName().trim());
        resetRequest.setStatus("PENDING");
        return toPasswordResetRequestResponse(passwordResetRequestRepository.save(resetRequest));
    }

    @Transactional(readOnly = true)
    public List<PasswordResetRequestResponse> getPasswordResetRequests(String status) {
        String requestStatus = StringUtils.hasText(status) ? status.trim().toUpperCase(Locale.ROOT) : "PENDING";
        return passwordResetRequestRepository.findByStatusOrderByCreatedAtDesc(requestStatus).stream()
                .map(this::toPasswordResetRequestResponse)
                .toList();
    }

    @Transactional
    public AdminResetPasswordResponse approvePasswordResetRequest(UUID requestId, ResetPasswordRequest request, String adminUsername) {
        PasswordResetRequest resetRequest = passwordResetRequestRepository.findById(requestId)
                .orElseThrow(() -> new ResourceNotFoundException("Không tìm thấy yêu cầu reset mật khẩu"));
        if (!"PENDING".equalsIgnoreCase(resetRequest.getStatus())) {
            throw new BusinessException("Yêu cầu reset mật khẩu đã được xử lý");
        }

        User user = resetRequest.getUser();
        if (user.getPerson().getDateOfBirth() == null) {
            throw new BusinessException("Không thể reset mật khẩu vì tài khoản chưa có ngày sinh");
        }

        String defaultPassword = user.getPerson().getDateOfBirth().format(DEFAULT_PASSWORD_FORMAT);
        user.setPasswordHash(passwordEncoder.encode(defaultPassword));
        user.setRequirePasswordChange(true);
        user.setAccessFailedCount(0);
        user.setLockoutEndAt(null);
        user.setLockReason(null);
        user.setConfirmationToken(UUID.randomUUID().toString());
        userRepository.save(user);
        String confirmationLink = buildConfirmationLink(user.getConfirmationToken());
        emailNotificationServiceProvider.ifAvailable(service -> service.sendPasswordResetConfirmation(user, defaultPassword, confirmationLink));

        resetRequest.setStatus("APPROVED");
        resetRequest.setAdminNote(request != null ? request.getAdminNote() : null);
        resetRequest.setProcessedAt(LocalDateTime.now());
        userRepository.findByUsername(adminUsername).ifPresent(admin -> resetRequest.setProcessedBy(admin.getUserId()));
        passwordResetRequestRepository.save(resetRequest);

        return AdminResetPasswordResponse.builder()
                .username(user.getUsername())
                .emailEdu(user.getEmail())
                .defaultPassword(defaultPassword)
                .confirmationToken(user.getConfirmationToken())
                .confirmationLink(confirmationLink)
                .requirePasswordChange(user.getRequirePasswordChange())
                .build();
    }

    @Transactional
    public void rejectPasswordResetRequest(UUID requestId, ResetPasswordRequest request, String adminUsername) {
        PasswordResetRequest resetRequest = passwordResetRequestRepository.findById(requestId)
                .orElseThrow(() -> new ResourceNotFoundException("Không tìm thấy yêu cầu reset mật khẩu"));
        if (!"PENDING".equalsIgnoreCase(resetRequest.getStatus())) {
            throw new BusinessException("Yêu cầu reset mật khẩu đã được xử lý");
        }
        resetRequest.setStatus("REJECTED");
        resetRequest.setAdminNote(request != null ? request.getAdminNote() : null);
        resetRequest.setProcessedAt(LocalDateTime.now());
        userRepository.findByUsername(adminUsername).ifPresent(admin -> resetRequest.setProcessedBy(admin.getUserId()));
        passwordResetRequestRepository.save(resetRequest);
    }

    @Transactional
    public void confirmEmail(String token) {
        if (!StringUtils.hasText(token)) {
            throw new BusinessException("Token xác nhận không hợp lệ");
        }
        User user = userRepository.findByConfirmationToken(token)
                .orElseThrow(() -> new ResourceNotFoundException("Token xác nhận không tồn tại"));
        user.setEmailConfirmed(true);
        user.setConfirmationToken(null);
        userRepository.save(user);
    }

    @Transactional
    public void logout(String username) {
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new ResourceNotFoundException("Không tìm thấy tài khoản"));
        List<UserSession> sessions = userSessionRepository.findAllByUser_UserId(user.getUserId());
        sessions.forEach(s -> s.setRevokedAt(LocalDateTime.now()));
        userSessionRepository.saveAll(sessions);
    }

    private void validateForgotPasswordRequest(ForgotPasswordRequest request) {
        if (!StringUtils.hasText(request.getRequesterCode())) {
            throw new BusinessException("Mã sinh viên/giảng viên/nhân viên không được để trống");
        }
        if (!StringUtils.hasText(request.getEmailEdu())) {
            throw new BusinessException("Email edu không được để trống");
        }
        if (!StringUtils.hasText(request.getPhoneNumber())) {
            throw new BusinessException("Số điện thoại không được để trống");
        }
        if (!StringUtils.hasText(request.getFullName())) {
            throw new BusinessException("Họ tên không được để trống");
        }
    }

    private boolean matchesIdentity(User user, ForgotPasswordRequest request) {
        if (user.getPerson() == null) {
            return false;
        }
        boolean personMatched = request.getFullName().trim().equalsIgnoreCase(user.getPerson().getFullName())
                && request.getPhoneNumber().trim().equalsIgnoreCase(user.getPerson().getPhoneNumber());
        if (!personMatched) {
            return false;
        }

        String code = request.getRequesterCode().trim();
        UUID personId = user.getPerson().getPersonId();
        boolean studentMatched = studentRepository.findByPersonPersonId(personId)
                .map(student -> code.equalsIgnoreCase(student.getStudentCode()))
                .orElse(false);
        boolean employeeMatched = employeeRepository.findByPersonPersonId(personId)
                .map(employee -> codeMatchesEmployee(code, employee))
                .orElse(false);
        return studentMatched || employeeMatched;
    }

    private boolean codeMatchesEmployee(String code, Employee employee) {
        if (code.equalsIgnoreCase(employee.getEmployeeCode())) {
            return true;
        }
        boolean instructorMatched = instructorProfileRepository.findByEmployeeEmployeeId(employee.getEmployeeId())
                .map(instructor -> code.equalsIgnoreCase(instructor.getInstructorCode()))
                .orElse(false);
        boolean staffMatched = staffRepository.findByEmployeeIdAndDeletedAtIsNull(employee.getEmployeeId())
                .map(staff -> code.equalsIgnoreCase(staff.getStaffCode()))
                .orElse(false);
        return instructorMatched || staffMatched;
    }

    private List<String> findRoleCodes(UUID userId) {
        return userRoleRepository.findActiveRolesByUserId(userId).stream()
                .map(UserRole::getRole)
                .map(role -> "ROLE_" + role.getCode())
                .toList();
    }

    private UUID resolveEmployeeId(User user) {
        if (user.getPerson() == null || user.getPerson().getPersonId() == null) {
            return null;
        }
        return employeeRepository.findByPersonPersonId(user.getPerson().getPersonId())
                .map(Employee::getEmployeeId)
                .orElse(null);
    }

    private PasswordResetRequestResponse toPasswordResetRequestResponse(PasswordResetRequest request) {
        PasswordResetRequestResponse response = new PasswordResetRequestResponse();
        response.setPasswordResetRequestId(request.getPasswordResetRequestId());
        response.setUserId(request.getUser().getUserId());
        response.setUsername(request.getUser().getUsername());
        response.setRequesterCode(request.getRequesterCode());
        response.setEmailEdu(request.getEmailEdu());
        response.setPhoneNumber(request.getPhoneNumber());
        response.setFullName(request.getFullName());
        response.setStatus(request.getStatus());
        response.setAdminNote(request.getAdminNote());
        response.setProcessedAt(request.getProcessedAt());
        response.setCreatedAt(request.getCreatedAt());
        return response;
    }

    private String buildConfirmationLink(String token) {
        String separator = passwordChangeUrl.contains("?") ? "&" : "?";
        return passwordChangeUrl + separator + "token=" + token;
    }
}

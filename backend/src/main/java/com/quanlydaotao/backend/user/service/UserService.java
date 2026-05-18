package com.quanlydaotao.backend.user.service;

import com.quanlydaotao.backend.common.exception.ResourceNotFoundException;
import com.quanlydaotao.backend.role.entity.Role;
import com.quanlydaotao.backend.role.repository.RoleRepository;
import com.quanlydaotao.backend.user.dto.AssignUserRolesRequest;
import com.quanlydaotao.backend.user.dto.LockUserAdminRequest;
import com.quanlydaotao.backend.user.dto.UpdateUserAdminRequest;
import com.quanlydaotao.backend.user.dto.UserAdminResponse;
import com.quanlydaotao.backend.user.entity.User;
import com.quanlydaotao.backend.user.entity.UserRole;
import com.quanlydaotao.backend.user.entity.UserRoleId;
import com.quanlydaotao.backend.user.entity.UserSession;
import com.quanlydaotao.backend.user.repository.UserRepository;
import com.quanlydaotao.backend.user.repository.UserRoleRepository;
import com.quanlydaotao.backend.user.repository.UserSessionRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.util.StringUtils;

import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class UserService {
    private final UserRepository userRepository;
    private final UserRoleRepository userRoleRepository;
    private final UserSessionRepository userSessionRepository;
    private final RoleRepository roleRepository;

    @Transactional(readOnly = true)
    public Page<UserAdminResponse> searchUsersForAdmin(String keyword, Boolean isActive, Boolean isLocked, Pageable pageable) {
        return userRepository.searchUsers(keyword, isActive, isLocked, pageable).map(this::toAdminResponse);
    }

    @Transactional(readOnly = true)
    public UserAdminResponse getUserForAdmin(UUID id) {
        return toAdminResponse(findUser(id));
    }

    @Transactional
    public UserAdminResponse updateUserForAdmin(UUID id, UpdateUserAdminRequest request) {
        User user = findUser(id);
        if (request.getIsActive() != null) {
            user.setIsActive(request.getIsActive());
            if (request.getIsActive()) {
                user.setDeletedAt(null);
            }
        }
        if (request.getRequirePasswordChange() != null) user.setRequirePasswordChange(request.getRequirePasswordChange());
        if (request.getEmailConfirmed() != null) user.setEmailConfirmed(request.getEmailConfirmed());
        if (request.getConfirmationToken() != null) user.setConfirmationToken(request.getConfirmationToken());
        if (request.getAccessFailedCount() != null) user.setAccessFailedCount(request.getAccessFailedCount());
        if (request.getLockoutEndAt() != null) user.setLockoutEndAt(request.getLockoutEndAt());
        if (request.getLockReason() != null) user.setLockReason(request.getLockReason());
        return toAdminResponse(userRepository.save(user));
    }

    @Transactional
    public void deleteUserForAdmin(UUID id) {
        User user = findUser(id);
        user.setIsActive(false);
        user.setDeletedAt(LocalDateTime.now());
        userRepository.save(user);
    }

    @Transactional
    public void lockUser(UUID id, LockUserAdminRequest request) {
        User user = findUser(id);
        user.setLockReason(StringUtils.hasText(request.getLockReason()) ? request.getLockReason() : "Khóa bởi quản trị viên");
        user.setLockoutEndAt(LocalDateTime.now().plusDays(request.getLockoutDays() != null ? request.getLockoutDays() : 9999));
        userRepository.save(user);
    }

    @Transactional
    public void unlockUser(UUID id) {
        User user = findUser(id);
        user.setLockReason(null);
        user.setLockoutEndAt(null);
        user.setAccessFailedCount(0);
        userRepository.save(user);
    }

    @Transactional
    public void restoreUser(UUID id) {
        User user = findUser(id);
        user.setDeletedAt(null);
        user.setIsActive(true);
        userRepository.save(user);
    }

    @Transactional(readOnly = true)
    public List<UserSession> getUserSessions(UUID id) {
        return userSessionRepository.findAllByUser_UserId(id);
    }

    @Transactional
    public void revokeAllUserSessions(UUID id) {
        List<UserSession> sessions = userSessionRepository.findAllByUser_UserId(id);
        sessions.forEach(s -> s.setRevokedAt(LocalDateTime.now()));
        userSessionRepository.saveAll(sessions);
    }

    @Transactional(readOnly = true)
    public List<String> getUserRoles(UUID id) {
        findUser(id);
        return findRoleCodes(id);
    }

    @Transactional
    public UserAdminResponse assignRoles(UUID id, AssignUserRolesRequest request) {
        User user = findUser(id);
        userRoleRepository.findByUserUserId(id).forEach(userRole -> {
            userRole.setIsActive(false);
            userRoleRepository.save(userRole);
        });

        if (request.getRoleIds() != null) {
            for (UUID roleId : request.getRoleIds()) {
                Role role = roleRepository.findById(roleId)
                        .orElseThrow(() -> new ResourceNotFoundException("Không tìm thấy vai trò"));
                UserRoleId userRoleId = new UserRoleId(user.getUserId(), role.getRoleId());
                UserRole userRole = userRoleRepository.findById(userRoleId).orElseGet(UserRole::new);
                userRole.setId(userRoleId);
                userRole.setUser(user);
                userRole.setRole(role);
                userRole.setIsActive(true);
                userRoleRepository.save(userRole);
            }
        }
        return toAdminResponse(user);
    }

    private User findUser(UUID id) {
        return userRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Không tìm thấy tài khoản"));
    }

    private UserAdminResponse toAdminResponse(User user) {
        UserAdminResponse response = new UserAdminResponse();
        response.setUserId(user.getUserId());
        response.setPersonId(user.getPerson() != null ? user.getPerson().getPersonId() : null);
        response.setUsername(user.getUsername());
        response.setEmail(user.getEmail());
        response.setLastLoginAt(user.getLastLoginAt());
        response.setAccessFailedCount(user.getAccessFailedCount());
        response.setLockoutEndAt(user.getLockoutEndAt());
        response.setLockReason(user.getLockReason());
        response.setRequirePasswordChange(user.getRequirePasswordChange());
        response.setEmailConfirmed(user.getEmailConfirmed());
        response.setConfirmationToken(user.getConfirmationToken());
        response.setIsActive(user.getIsActive());
        response.setCreatedAt(user.getCreatedAt());
        response.setUpdatedAt(user.getUpdatedAt());
        response.setDeletedAt(user.getDeletedAt());
        response.setRoles(findRoleCodes(user.getUserId()));
        return response;
    }

    private List<String> findRoleCodes(UUID userId) {
        return userRoleRepository.findActiveRolesByUserId(userId).stream()
                .map(UserRole::getRole)
                .map(role -> role.getCode())
                .toList();
    }
}

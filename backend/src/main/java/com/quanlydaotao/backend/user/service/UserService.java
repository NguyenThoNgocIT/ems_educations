package com.quanlydaotao.backend.user.service;
import com.quanlydaotao.backend.user.dto.*;
import com.quanlydaotao.backend.person.entity.Person;
import com.quanlydaotao.backend.user.entity.User;
import com.quanlydaotao.backend.person.repository.PersonRepository;
import com.quanlydaotao.backend.user.repository.UserRepository;
import com.quanlydaotao.backend.user.repository.UserSessionRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.time.LocalDateTime;
import java.util.UUID;
import java.util.List;
@Service
@RequiredArgsConstructor
public class UserService {
    private final UserRepository userRepository;
    private final PersonRepository personRepository;
    private final UserSessionRepository userSessionRepository;
    private final PasswordEncoder passwordEncoder;
    private UserDto mapToDto(User user) {
        UserDto dto = new UserDto();
        dto.setUserId(user.getUserId());
        dto.setPersonId(user.getPerson() != null ? user.getPerson().getPersonId() : null);
        dto.setUsername(user.getUsername());
        dto.setEmail(user.getEmail());
        dto.setLastLoginAt(user.getLastLoginAt());
        dto.setAccessFailedCount(user.getAccessFailedCount());
        dto.setLockoutEndAt(user.getLockoutEndAt());
        dto.setLockReason(user.getLockReason());
        dto.setRequirePasswordChange(user.getRequirePasswordChange());
        dto.setIsActive(user.getIsActive());
        dto.setDeletedAt(user.getDeletedAt());
        return dto;
    }
    @Transactional(readOnly = true)
    public Page<UserDto> searchUsers(String keyword, Boolean isActive, Boolean isLocked, Pageable pageable) {
        return userRepository.searchUsers(keyword, isActive, isLocked, pageable).map(this::mapToDto);
    }
    @Transactional(readOnly = true)
    public UserDto getUserById(UUID id) {
        return userRepository.findById(id).map(this::mapToDto).orElseThrow();
    }
    @Transactional
    public UserDto createUser(CreateUserRequest request) {
        Person person = personRepository.findById(request.getPersonId()).orElseThrow();
        User user = new User();
        user.setPerson(person);
        user.setUsername(request.getUsername());
        user.setEmail(request.getEmail());
        String generatedPass = UUID.randomUUID().toString().substring(0, 8); // Simple mock generatated pass
        user.setPasswordHash(passwordEncoder.encode(generatedPass));
        user.setRequirePasswordChange(true);
        // FIXME: Send email here
        return mapToDto(userRepository.save(user));
    }
    @Transactional
    public UserDto updateUser(UUID id, UpdateUserRequest request) {
        User user = userRepository.findById(id).orElseThrow();
        if (request.getIsActive() != null) user.setIsActive(request.getIsActive());
        return mapToDto(userRepository.save(user));
    }
    @Transactional
    public void deleteUser(UUID id) {
        User user = userRepository.findById(id).orElseThrow();
        user.setIsActive(false);
        user.setDeletedAt(LocalDateTime.now());
        userRepository.save(user);
    }
    @Transactional
    public void lockUser(UUID id, LockUserRequest request) {
        User user = userRepository.findById(id).orElseThrow();
        user.setLockReason(request.getLockReason());
        user.setLockoutEndAt(LocalDateTime.now().plusDays(request.getLockoutDays() != null ? request.getLockoutDays() : 9999));
        userRepository.save(user);
    }
    @Transactional
    public void unlockUser(UUID id) {
        User user = userRepository.findById(id).orElseThrow();
        user.setLockReason(null);
        user.setLockoutEndAt(null);
        user.setAccessFailedCount(0);
        userRepository.save(user);
    }
    @Transactional
    public void restoreUser(UUID id) {
        User user = userRepository.findById(id).orElseThrow();
        user.setDeletedAt(null);
        user.setIsActive(true);
        userRepository.save(user);
    }
    @Transactional
    public void adminResetPassword(UUID id, AdminResetPasswordRequest request) {
        User user = userRepository.findById(id).orElseThrow();
        user.setPasswordHash(passwordEncoder.encode(request.getNewPassword()));
        user.setRequirePasswordChange(true);
        userRepository.save(user);
    }
    @Transactional(readOnly = true)
    public List<com.quanlydaotao.backend.user.entity.UserSession> getUserSessions(UUID id) {
        return userSessionRepository.findAllByUser_UserId(id);
    }
    @Transactional
    public void revokeAllUserSessions(UUID id) {
        List<com.quanlydaotao.backend.user.entity.UserSession> sessions = userSessionRepository.findAllByUser_UserId(id);
        sessions.forEach(s -> s.setRevokedAt(LocalDateTime.now()));
        userSessionRepository.saveAll(sessions);
    }
}



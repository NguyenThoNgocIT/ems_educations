package com.quanlydaotao.backend.user.service;

import com.quanlydaotao.backend.role.entity.Role;
import com.quanlydaotao.backend.role.repository.RoleRepository;
import com.quanlydaotao.backend.user.dto.CreateUserRequest;
import com.quanlydaotao.backend.user.dto.UpdateUserRequest;
import com.quanlydaotao.backend.user.dto.UserResponse;
import com.quanlydaotao.backend.user.entity.Person;
import com.quanlydaotao.backend.user.entity.User;
import com.quanlydaotao.backend.user.entity.UserRole;
import com.quanlydaotao.backend.user.entity.UserRoleId;
import com.quanlydaotao.backend.user.repository.PersonRepository;
import com.quanlydaotao.backend.user.repository.UserRepository;
import com.quanlydaotao.backend.user.repository.UserRoleRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Transactional
public class UserService {
    
    private final UserRepository userRepository;
    private final PersonRepository personRepository;
    private final UserRoleRepository userRoleRepository;
    private final RoleRepository roleRepository;
    private final PasswordEncoder passwordEncoder;

    // Get all users
    public List<UserResponse> getAllUsers() {
        return userRepository.findAll().stream()
                .map(this::convertToResponse)
                .collect(Collectors.toList());
    }

    // Get user by ID
    public UserResponse getUserById(UUID userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found with id: " + userId));
        return convertToResponse(user);
    }

    // Create user
    public UserResponse createUser(CreateUserRequest request) {
        // Create Person first
        Person person = new Person();
        person.setFullName(request.getFullName());
        person.setPhoneNumber(request.getPhoneNumber());
        person.setContactEmail(request.getEmail());
        person = personRepository.save(person);

        // Create User
        User user = new User();
        user.setPerson(person);
        user.setUsername(request.getUsername());
        user.setPasswordHash(passwordEncoder.encode(request.getPassword()));
        user.setEmail(request.getEmail());
        user.setAccessFailedCount(0);
        user = userRepository.save(user);

        // Assign role if provided
        if (request.getRole() != null && !request.getRole().isEmpty()) {
            Role role = roleRepository.findByCode(request.getRole())
                    .orElseThrow(() -> new RuntimeException("Role not found: " + request.getRole()));
            
            UserRoleId userRoleId = new UserRoleId();
            userRoleId.setUserId(user.getUserId());
            userRoleId.setRoleId(role.getRoleId());
            
            UserRole userRole = new UserRole();
            userRole.setId(userRoleId);
            userRole.setUser(user);
            userRole.setRole(role);
            userRole.setIsActive(true);
            userRoleRepository.save(userRole);
        }

        return convertToResponse(user);
    }

    // Update user
    public UserResponse updateUser(UUID userId, UpdateUserRequest request) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found with id: " + userId));

        Person person = user.getPerson();
        if (person != null) {
            person.setFullName(request.getFullName());
            person.setPhoneNumber(request.getPhoneNumber());
            person.setContactEmail(request.getEmail());
            personRepository.save(person);
        }

        user.setEmail(request.getEmail());
        user = userRepository.save(user);

        // Update role if provided
        if (request.getRole() != null && !request.getRole().isEmpty()) {
            // Remove old roles
            userRoleRepository.deleteByUserId(user.getUserId());
            
            // Assign new role
            Role role = roleRepository.findByCode(request.getRole())
                    .orElseThrow(() -> new RuntimeException("Role not found: " + request.getRole()));
            
            UserRoleId userRoleId = new UserRoleId();
            userRoleId.setUserId(user.getUserId());
            userRoleId.setRoleId(role.getRoleId());
            
            UserRole userRole = new UserRole();
            userRole.setId(userRoleId);
            userRole.setUser(user);
            userRole.setRole(role);
            userRole.setIsActive(true);
            userRoleRepository.save(userRole);
        }

        return convertToResponse(user);
    }

    // Delete user
    public void deleteUser(UUID userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found with id: " + userId));
        
        // Delete user roles first
        userRoleRepository.deleteByUserId(userId);
        
        // Delete user
        userRepository.delete(user);
        
        // Delete person if exists
        if (user.getPerson() != null) {
            personRepository.delete(user.getPerson());
        }
    }

    // Lock user
    public UserResponse lockUser(UUID userId, String reason) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found with id: " + userId));
        
        user.setLockoutEndAt(LocalDateTime.now().plusYears(100)); // Lock for 100 years
        user.setLockReason(reason);
        user = userRepository.save(user);
        
        return convertToResponse(user);
    }

    // Unlock user
    public UserResponse unlockUser(UUID userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found with id: " + userId));
        
        user.setLockoutEndAt(null);
        user.setLockReason(null);
        user.setAccessFailedCount(0);
        user = userRepository.save(user);
        
        return convertToResponse(user);
    }

    // Helper method to convert User to UserResponse
    private UserResponse convertToResponse(User user) {
        UserResponse response = new UserResponse();
        response.setUserId(user.getUserId());
        response.setUsername(user.getUsername());
        response.setEmail(user.getEmail());
        response.setLastLogin(user.getLastLoginAt());
        
        if (user.getPerson() != null) {
            response.setFullName(user.getPerson().getFullName());
            response.setPhoneNumber(user.getPerson().getPhoneNumber());
        }

        // Determine status
        if (user.getLockoutEndAt() != null && user.getLockoutEndAt().isAfter(LocalDateTime.now())) {
            response.setStatus("Locked");
        } else if (user.getDeletedAt() != null) {
            response.setStatus("Inactive");
        } else {
            response.setStatus("Active");
        }

        // Get roles
        List<String> roles = userRoleRepository.findByUserId(user.getUserId()).stream()
                .map(ur -> ur.getRole().getCode())
                .collect(Collectors.toList());
        response.setRoles(roles);

        return response;
    }
}

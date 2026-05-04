package com.quanlydaotao.backend.user.controller;

import com.quanlydaotao.backend.user.dto.CreateUserRequest;
import com.quanlydaotao.backend.user.dto.UpdateUserRequest;
import com.quanlydaotao.backend.user.dto.UserResponse;
import com.quanlydaotao.backend.user.service.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/v1/users")
@RequiredArgsConstructor
@CrossOrigin("*")
public class UserController {
    
    private final UserService userService;

    /**
     * Get all users
     */
    @GetMapping
    public ResponseEntity<List<UserResponse>> getAllUsers() {
        List<UserResponse> users = userService.getAllUsers();
        return ResponseEntity.ok(users);
    }

    /**
     * Get user by ID
     */
    @GetMapping("/{id}")
    public ResponseEntity<UserResponse> getUserById(@PathVariable UUID id) {
        UserResponse user = userService.getUserById(id);
        return ResponseEntity.ok(user);
    }

    /**
     * Create new user
     */
    @PostMapping
    public ResponseEntity<UserResponse> createUser(@RequestBody CreateUserRequest request) {
        UserResponse user = userService.createUser(request);
        return ResponseEntity.status(HttpStatus.CREATED).body(user);
    }

    /**
     * Update user
     */
    @PutMapping("/{id}")
    public ResponseEntity<UserResponse> updateUser(
            @PathVariable UUID id,
            @RequestBody UpdateUserRequest request) {
        UserResponse user = userService.updateUser(id, request);
        return ResponseEntity.ok(user);
    }

    /**
     * Delete user
     */
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteUser(@PathVariable UUID id) {
        userService.deleteUser(id);
        return ResponseEntity.noContent().build();
    }

    /**
     * Lock user account
     */
    @PostMapping("/{id}/lock")
    public ResponseEntity<UserResponse> lockUser(
            @PathVariable UUID id,
            @RequestParam(required = false, defaultValue = "Account locked by admin") String reason) {
        UserResponse user = userService.lockUser(id, reason);
        return ResponseEntity.ok(user);
    }

    /**
     * Unlock user account
     */
    @PostMapping("/{id}/unlock")
    public ResponseEntity<UserResponse> unlockUser(@PathVariable UUID id) {
        UserResponse user = userService.unlockUser(id);
        return ResponseEntity.ok(user);
    }
}

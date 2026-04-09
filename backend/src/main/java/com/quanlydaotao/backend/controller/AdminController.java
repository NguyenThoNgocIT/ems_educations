package com.quanlydaotao.backend.controller;

import com.quanlydaotao.backend.user.AdminCreateUserRequest;
import com.quanlydaotao.backend.user.UpdateUserRequest;
import com.quanlydaotao.backend.user.User;
import com.quanlydaotao.backend.user.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/admin")
@RequiredArgsConstructor
@PreAuthorize("hasRole('ADMIN')")
public class AdminController {

    private final UserService userService;

    @GetMapping("/")
    public ResponseEntity<String> getAdminDashboard() {
        return ResponseEntity.ok("Admin API working");
    }

    @PostMapping("/users")
    public ResponseEntity<User> createUser(@RequestBody AdminCreateUserRequest request) {
        User user = userService.createUserByAdmin(request);
        return ResponseEntity.ok(user);
    }

    @GetMapping("/users")
    public ResponseEntity<List<User>> getAllUsers(@RequestParam(required = false) String role) {
        List<User> users = userService.getAllUsers(role);
        return ResponseEntity.ok(users);
    }

    @GetMapping("/users/{id}")
    public ResponseEntity<User> getUserById(@PathVariable Integer id) {
        User user = userService.getUserById(id);
        return ResponseEntity.ok(user);
    }

    @PutMapping("/users/{id}")
    public ResponseEntity<User> updateUser(@PathVariable Integer id, @RequestBody UpdateUserRequest request) {
        User user = userService.updateUser(id, request);
        return ResponseEntity.ok(user);
    }

    @DeleteMapping("/users/{id}")
    public ResponseEntity<Void> deleteUser(@PathVariable Integer id) {
        userService.deleteUser(id);
        return ResponseEntity.noContent().build();
    }
}

package com.quanlydaotao.backend.user;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RequestPart;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import java.security.Principal;
import java.util.List;

@RestController
@RequestMapping("/api/v1")
@RequiredArgsConstructor
public class UserController {

    private final UserService service;

    @PatchMapping("/users/password")
    public ResponseEntity<?> changePassword(
          @Valid @RequestBody ChangePasswordRequest request,
          Principal connectedUser
    ) {
        service.changePassword(request, connectedUser);
        return ResponseEntity.ok().build();
    }

    @PreAuthorize("hasAnyRole('ADMIN','MANAGER')")
    @GetMapping("/admin/users")
    public ResponseEntity<List<User>> getAllUsers(@RequestParam(required = false) String role) {
        return ResponseEntity.ok(service.getAllUsers(role));
    }

    @PreAuthorize("hasAnyRole('ADMIN','MANAGER')")
    @GetMapping("/admin/users/{id}")
    public ResponseEntity<User> getUserById(@PathVariable Integer id) {
        return ResponseEntity.ok(service.getUserById(id));
    }

    @PreAuthorize("hasAnyRole('ADMIN','MANAGER')")
    @PostMapping("/admin/users")
    public ResponseEntity<User> createUserByAdmin(@Valid @RequestBody AdminCreateUserRequest request) {
        return ResponseEntity.ok(service.createUserByAdmin(request));
    }

    @PreAuthorize("hasAnyRole('ADMIN','MANAGER')")
    @PutMapping("/admin/users/{id}")
    public ResponseEntity<User> updateUser(
            @PathVariable Integer id,
            @Valid @RequestBody UpdateUserRequest request
    ) {
        return ResponseEntity.ok(service.updateUser(id, request));
    }

    @PreAuthorize("hasAnyRole('ADMIN','MANAGER')")
    @DeleteMapping("/admin/users/{id}")
    public ResponseEntity<String> deleteUser(@PathVariable Integer id) {
        service.deleteUser(id);
        return ResponseEntity.ok("User deleted successfully");
    }

    @PreAuthorize("hasAnyRole('ADMIN','MANAGER')")
    @PatchMapping("/admin/users/{id}/lock")
    public ResponseEntity<User> lockUser(@PathVariable Integer id) {
        return ResponseEntity.ok(service.lockUser(id));
    }

    @PreAuthorize("hasAnyRole('ADMIN','MANAGER')")
    @PatchMapping("/admin/users/{id}/unlock")
    public ResponseEntity<User> unlockUser(@PathVariable Integer id) {
        return ResponseEntity.ok(service.unlockUser(id));
    }

    @PreAuthorize("hasAnyRole('ADMIN','MANAGER')")
    @PostMapping("/admin/users/{id}/avatar")
    public ResponseEntity<User> uploadAvatar(
            @PathVariable Integer id,
            @RequestPart("file") MultipartFile file
    ) {
        return ResponseEntity.ok(service.uploadAvatar(id, file));
    }

    @PreAuthorize("hasAnyRole('ADMIN','MANAGER')")
    @GetMapping("/admin/users/search")
    public ResponseEntity<List<User>> searchUsers(@RequestParam(required = false) String keyword) {
        return ResponseEntity.ok(service.searchUsers(keyword));
    }
}

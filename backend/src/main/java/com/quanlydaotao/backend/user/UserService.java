package com.quanlydaotao.backend.user;

import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.security.Principal;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class UserService {

    private final PasswordEncoder passwordEncoder;
    private final UserRepository repository;

    public User createUserByAdmin(AdminCreateUserRequest request) {
        String[] nameParts = request.getFullName().trim().split("\\s+", 2);
        String firstname = nameParts[0];
        String lastname = nameParts.length > 1 ? nameParts[1] : "";

        User user = User.builder()
                .firstname(firstname)
                .lastname(lastname)
                .email(request.getEmail())
                .password(passwordEncoder.encode(request.getPassword()))
                .role(Role.valueOf(request.getRole().toUpperCase()))
                .build();

        return repository.save(user);
    }

    public List<User> getAllUsers(String role) {
        List<User> users = repository.findAll();
        if (role != null && !role.isEmpty()) {
            Role r = Role.valueOf(role.toUpperCase());
            users = users.stream()
                    .filter(u -> u.getRole() == r)
                    .collect(Collectors.toList());
        }
        return users;
    }

    public User updateUser(Integer id, UpdateUserRequest request) {
        User user = repository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("User not found"));

        if (request.getEmail() != null) {
            user.setEmail(request.getEmail());
        }

        if (request.getFullName() != null) {
            String[] nameParts = request.getFullName().trim().split("\\s+", 2);
            user.setFirstname(nameParts[0]);
            user.setLastname(nameParts.length > 1 ? nameParts[1] : "");
        }

        if (request.getRole() != null) {
            user.setRole(Role.valueOf(request.getRole().toUpperCase()));
        }

        return repository.save(user);
    }

    public void deleteUser(Integer id) {
        if (!repository.existsById(id)) {
            throw new IllegalArgumentException("User not found");
        }
        repository.deleteById(id);
    }

    public User getUserById(Integer id) {
        return repository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("User not found"));
    }

    public void changePassword(ChangePasswordRequest request, Principal connectedUser) {

        var user = (User) ((UsernamePasswordAuthenticationToken) connectedUser).getPrincipal();

        // check if the current password is correct
        if (!passwordEncoder.matches(request.getCurrentPassword(), user.getPassword())) {
            throw new IllegalStateException("Wrong password");
        }
        // check if the two new passwords are the same
        if (!request.getNewPassword().equals(request.getConfirmationPassword())) {
            throw new IllegalStateException("Password are not the same");
        }

        // update the password
        user.setPassword(passwordEncoder.encode(request.getNewPassword()));

        // save the new password
        repository.save(user);
    }
}

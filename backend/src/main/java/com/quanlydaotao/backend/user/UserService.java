package com.quanlydaotao.backend.user;

import com.quanlydaotao.backend.exception.BadRequestException;
import com.quanlydaotao.backend.exception.NotFoundException;
import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
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
                .locked(false)
                .build();

        return repository.save(user);
    }

    public User uploadAvatar(Integer id, MultipartFile file) {
        User user = getUserById(id);
        try {
            user.setAvatar(file.getBytes());
        } catch (IOException e) {
            throw new BadRequestException("Unable to read avatar file");
        }
        return repository.save(user);
    }

    public User lockUser(Integer id) {
        User user = getUserById(id);
        user.setLocked(true);
        return repository.save(user);
    }

    public User unlockUser(Integer id) {
        User user = getUserById(id);
        user.setLocked(false);
        return repository.save(user);
    }

    public List<User> searchUsers(String keyword) {
        if (keyword == null || keyword.isBlank()) {
            return getAllUsers(null);
        }
        String lowerKeyword = keyword.toLowerCase();
        return repository.findAll().stream()
                .filter(u -> u.getEmail().toLowerCase().contains(lowerKeyword)
                        || u.getFirstname().toLowerCase().contains(lowerKeyword)
                        || u.getLastname().toLowerCase().contains(lowerKeyword))
                .collect(Collectors.toList());
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
                .orElseThrow(() -> new NotFoundException("User not found"));

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
            throw new NotFoundException("User not found");
        }
        repository.deleteById(id);
    }

    public User getUserById(Integer id) {
        return repository.findById(id)
                .orElseThrow(() -> new NotFoundException("User not found"));
    }

    public void changePassword(ChangePasswordRequest request, Principal connectedUser) {

        var user = (User) ((UsernamePasswordAuthenticationToken) connectedUser).getPrincipal();

        if (!passwordEncoder.matches(request.getCurrentPassword(), user.getPassword())) {
            throw new BadRequestException("Wrong password");
        }

        if (!request.getNewPassword().equals(request.getConfirmationPassword())) {
            throw new BadRequestException("Password are not the same");
        }

        user.setPassword(passwordEncoder.encode(request.getNewPassword()));
        repository.save(user);
    }
}

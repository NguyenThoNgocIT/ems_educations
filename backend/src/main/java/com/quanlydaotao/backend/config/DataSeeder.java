package com.quanlydaotao.backend.config;

import com.quanlydaotao.backend.user.Role;
import com.quanlydaotao.backend.user.User;
import com.quanlydaotao.backend.user.UserRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

import java.util.List;

@Slf4j
@Component
@RequiredArgsConstructor
public class DataSeeder implements CommandLineRunner {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    @Override
    public void run(String... args) {
        seedUsers();
    }

    private void seedUsers() {
        List<UserSeed> users = List.of(
                new UserSeed("Admin", "DongA", "admin@donga.edu.vn", "admin123@.", Role.ADMIN),
                new UserSeed("Manager", "DongA", "manager@donga.edu.vn", "manager123@.", Role.MANAGER),
                new UserSeed("Consultant", "DongA", "consultant@donga.edu.vn", "consultant123@.", Role.CONSULTANT),
                new UserSeed("Teacher", "DongA", "teacher@donga.edu.vn", "teacher123@.", Role.TEACHER),
                new UserSeed("Student", "DongA", "student@donga.edu.vn", "student123@.", Role.STUDENT),
                new UserSeed("Parent", "DongA", "parent@donga.edu.vn", "parent123@.", Role.PARENT)
        );

        for (UserSeed seed : users) {
            if (userRepository.findByEmail(seed.email()).isEmpty()) {
                User user = User.builder()
                        .firstname(seed.firstname())
                        .lastname(seed.lastname())
                        .email(seed.email())
                        .password(passwordEncoder.encode(seed.password()))
                        .role(seed.role())
                        .build();

                userRepository.save(user);
                log.info(">>> Đã tạo tài khoản: {}", seed.email());
            } else {
                log.info(">>> Đã tồn tại tài khoản: {}", seed.email());
            }
        }
    }

    private record UserSeed(
            String firstname,
            String lastname,
            String email,
            String password,
            Role role
    ) {}
}
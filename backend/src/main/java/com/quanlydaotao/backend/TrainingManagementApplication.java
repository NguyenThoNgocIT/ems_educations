package com.quanlydaotao.backend;

import com.quanlydaotao.backend.user.repository.UserRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.Bean;
import org.springframework.security.crypto.password.PasswordEncoder;

@SpringBootApplication
public class TrainingManagementApplication {

    public static void main(String[] args) {
        SpringApplication.run(TrainingManagementApplication.class, args);
    }

    @Bean
    public CommandLineRunner initData(UserRepository userRepository, PasswordEncoder passwordEncoder) {
        return args -> {
            userRepository.findByUsername("admin").ifPresent(user -> {
                user.setPasswordHash(passwordEncoder.encode("123456"));
                userRepository.save(user);
                System.out.println("✅ [Hệ thống] Đã đặt lại mật khẩu admin là: 123456");
            });
        };
    }
}

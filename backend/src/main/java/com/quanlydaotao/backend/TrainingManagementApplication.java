package com.quanlydaotao.backend;

import com.quanlydaotao.backend.role.entity.Role;
import com.quanlydaotao.backend.role.repository.RoleRepository;
import com.quanlydaotao.backend.user.entity.Person;
import com.quanlydaotao.backend.user.entity.User;
import com.quanlydaotao.backend.user.entity.UserRole;
import com.quanlydaotao.backend.user.entity.UserRoleId;
import com.quanlydaotao.backend.user.repository.PersonRepository;
import com.quanlydaotao.backend.user.repository.UserRepository;
import com.quanlydaotao.backend.user.repository.UserRoleRepository;
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
    public CommandLineRunner initData(
            PersonRepository personRepository,
            UserRepository userRepository,
            RoleRepository roleRepository,
            UserRoleRepository userRoleRepository,
            PasswordEncoder passwordEncoder
    ) {
        return args -> {
            // Initialization logic if any
        };
    }
}
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
            Role adminRole = roleRepository.findByCode("ADMIN").orElseGet(() -> {
                Role newRole = new Role();
                newRole.setCode("ADMIN");
                newRole.setName("Quản trị viên");
                newRole.setDescription("Toàn quyền hệ thống");
                newRole.setIsActive(true);
                return roleRepository.save(newRole);
            });

            User user = userRepository.findByUsername("admin").orElseGet(() -> {
                Person adminPerson = new Person();
                adminPerson.setFullName("Administrator");
                adminPerson.setContactEmail("admin@localhost");
                adminPerson.setPhoneNumber("0000000000");
                adminPerson.setIsActive(true);
                personRepository.save(adminPerson);

                User newUser = new User();
                newUser.setPerson(adminPerson);
                newUser.setUsername("admin");
                newUser.setEmail("admin@localhost");
                newUser.setPasswordHash(passwordEncoder.encode("123456"));
                newUser.setRequirePasswordChange(false);
                return userRepository.save(newUser);
            });

            if (!passwordEncoder.matches("123456", user.getPasswordHash())) {
                user.setPasswordHash(passwordEncoder.encode("123456"));
                userRepository.save(user);
            }

            UserRoleId userRoleId = new UserRoleId(user.getUserId(), adminRole.getRoleId());
            if (!userRoleRepository.existsById(userRoleId)) {
                UserRole userRole = new UserRole();
                userRole.setId(userRoleId);
                userRole.setUser(user);
                userRole.setRole(adminRole);
                userRole.setIsActive(true);
                userRoleRepository.save(userRole);
            }

            System.out.println("✅ [Hệ thống] Đã tạo/đồng bộ admin với username=admin, mật khẩu=123456 và role=ADMIN");
        };
    }
}

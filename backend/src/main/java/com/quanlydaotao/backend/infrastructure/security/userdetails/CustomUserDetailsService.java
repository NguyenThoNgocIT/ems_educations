package com.quanlydaotao.backend.infrastructure.security.userdetails;

import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.transaction.annotation.Transactional;

import com.quanlydaotao.backend.user.entity.User;
import com.quanlydaotao.backend.user.entity.UserRole;
import com.quanlydaotao.backend.user.repository.UserRepository;
import com.quanlydaotao.backend.user.repository.UserRoleRepository;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class CustomUserDetailsService implements UserDetailsService {

    private final UserRepository userRepository;
    private final UserRoleRepository userRoleRepository;

    public CustomUserDetailsService(UserRepository userRepository, UserRoleRepository userRoleRepository) {
        this.userRepository = userRepository;
        this.userRoleRepository = userRoleRepository;
    }

    @Override
    @Transactional(readOnly = true)
    public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new UsernameNotFoundException("Không tìm thấy người dùng: " + username));

        if (!user.getIsActive()) {
            throw new UsernameNotFoundException("Tài khoản đã bị vô hiệu hóa.");
        }

        List<UserRole> activeRoles = userRoleRepository.findActiveRolesByUserId(user.getUserId());
        List<SimpleGrantedAuthority> authorities = activeRoles.stream()
                .map(userRole -> new SimpleGrantedAuthority("ROLE_" + userRole.getRole().getCode()))
                .collect(Collectors.toList());

        return new CustomUserDetails(
                user.getUserId().toString(),
                user.getUsername(),
                user.getPasswordHash(),
                authorities
        );
    }
}

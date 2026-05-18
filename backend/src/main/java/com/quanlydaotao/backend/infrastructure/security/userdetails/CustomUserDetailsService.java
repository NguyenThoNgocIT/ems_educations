package com.quanlydaotao.backend.infrastructure.security.userdetails;

import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.transaction.annotation.Transactional;

import com.quanlydaotao.backend.user.entity.User;
import com.quanlydaotao.backend.user.entity.UserRole;
import com.quanlydaotao.backend.role.repository.RolePermissionRepository;
import com.quanlydaotao.backend.user.repository.UserRepository;
import com.quanlydaotao.backend.user.repository.UserRoleRepository;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class CustomUserDetailsService implements UserDetailsService {

    private final UserRepository userRepository;
    private final UserRoleRepository userRoleRepository;
    private final RolePermissionRepository rolePermissionRepository;

    public CustomUserDetailsService(UserRepository userRepository, UserRoleRepository userRoleRepository, RolePermissionRepository rolePermissionRepository) {
        this.userRepository = userRepository;
        this.userRoleRepository = userRoleRepository;
        this.rolePermissionRepository = rolePermissionRepository;
    }

    @Override
    @Transactional(readOnly = true)
    public UserDetails loadUserByUsername(String loginId) throws UsernameNotFoundException {
        User user = userRepository.findByUsernameOrEmail(loginId, loginId)
                .orElseThrow(() -> new UsernameNotFoundException("Không tìm thấy người dùng: " + loginId));

        if (!user.getIsActive()) {
            throw new UsernameNotFoundException("Tài khoản đã bị vô hiệu hóa.");
        }

        List<UserRole> activeRoles = userRoleRepository.findActiveRolesByUserId(user.getUserId());
        List<SimpleGrantedAuthority> authorities = activeRoles.stream()
                .map(userRole -> new SimpleGrantedAuthority("ROLE_" + userRole.getRole().getCode()))
                .collect(Collectors.toList());
        rolePermissionRepository.findActivePermissionCodesByUserId(user.getUserId()).stream()
                .map(SimpleGrantedAuthority::new)
                .forEach(authorities::add);

        return new CustomUserDetails(
                user.getUserId().toString(),
                user.getUsername(),
                user.getPasswordHash(),
                authorities
        );
    }
}

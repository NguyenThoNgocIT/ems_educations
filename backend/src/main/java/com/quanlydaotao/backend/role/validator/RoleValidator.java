package com.quanlydaotao.backend.role.validator;

import com.quanlydaotao.backend.role.dto.request.CreateRoleRequest;
import com.quanlydaotao.backend.role.entity.Role;
import com.quanlydaotao.backend.role.repository.RoleRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
public class RoleValidator {

    private final RoleRepository roleRepository;

    public void validateCreateRole(CreateRoleRequest request) {
        if (roleRepository.existsByCode(request.getCode())) {
            throw new RuntimeException("Mã vai trò đã tồn tại: " + request.getCode());
        }
    }

    public void validateBeforeDelete(Role role) {
        if (role.getIsSystem() != null && role.getIsSystem()) {
            throw new RuntimeException("Không thể xóa vai trò hệ thống");
        }
    }
}
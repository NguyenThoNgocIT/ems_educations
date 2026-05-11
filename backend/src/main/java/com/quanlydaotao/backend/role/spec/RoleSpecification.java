package com.quanlydaotao.backend.role.spec;

import com.quanlydaotao.backend.role.entity.Role;
import org.springframework.data.jpa.domain.Specification;

public class RoleSpecification {

    public static Specification<Role> filterByCode(String code) {
        return (root, query, cb) -> {
            if (code == null || code.isEmpty()) {
                return cb.conjunction();
            }
            return cb.like(root.get("code"), "%" + code + "%");
        };
    }

    public static Specification<Role> filterByName(String name) {
        return (root, query, cb) -> {
            if (name == null || name.isEmpty()) {
                return cb.conjunction();
            }
            return cb.like(root.get("name"), "%" + name + "%");
        };
    }

    public static Specification<Role> filterByIsActive(Boolean isActive) {
        return (root, query, cb) -> {
            if (isActive == null) {
                return cb.conjunction();
            }
            return cb.equal(root.get("isActive"), isActive);
        };
    }
}
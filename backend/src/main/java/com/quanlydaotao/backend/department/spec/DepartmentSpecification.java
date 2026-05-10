package com.quanlydaotao.backend.department.spec;

import com.quanlydaotao.backend.department.dto.request.DepartmentSearchRequest;
import com.quanlydaotao.backend.department.entity.Department;
import jakarta.persistence.criteria.Predicate;
import org.springframework.data.jpa.domain.Specification;

import java.util.ArrayList;

public class DepartmentSpecification {

    public static Specification<Department> filterByCriteria(DepartmentSearchRequest request) {
        return (root, query, cb) -> {
            var predicates = new ArrayList<Predicate>();
            
            // Chỉ lấy bản ghi chưa xóa
            predicates.add(cb.isNull(root.get("deletedAt")));
            
            if (request.getCode() != null && !request.getCode().isEmpty()) {
                predicates.add(cb.like(root.get("code"), "%" + request.getCode() + "%"));
            }
            
            if (request.getName() != null && !request.getName().isEmpty()) {
                predicates.add(cb.like(root.get("name"), "%" + request.getName() + "%"));
            }
            
            if (request.getIsActive() != null) {
                predicates.add(cb.equal(root.get("isActive"), request.getIsActive()));
            }
            
            return cb.and(predicates.toArray(new Predicate[0]));
        };
    }
}
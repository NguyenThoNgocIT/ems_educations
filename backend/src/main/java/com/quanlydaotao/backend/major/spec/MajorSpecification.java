package com.quanlydaotao.backend.major.spec;

import com.quanlydaotao.backend.major.dto.request.MajorSearchRequest;
import com.quanlydaotao.backend.major.entity.Major;
import jakarta.persistence.criteria.Predicate;
import org.springframework.data.jpa.domain.Specification;

import java.util.ArrayList;

public class MajorSpecification {

    public static Specification<Major> filterByCriteria(MajorSearchRequest request) {
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
            
            if (request.getDepartmentId() != null && !request.getDepartmentId().isEmpty()) {
                predicates.add(cb.equal(root.get("department").get("departmentId"), request.getDepartmentId()));
            }
            
            if (request.getIsActive() != null) {
                predicates.add(cb.equal(root.get("isActive"), request.getIsActive()));
            }
            
            return cb.and(predicates.toArray(new Predicate[0]));
        };
    }
}
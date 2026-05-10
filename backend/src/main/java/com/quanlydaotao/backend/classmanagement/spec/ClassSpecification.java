package com.quanlydaotao.backend.classmanagement.spec;

import com.quanlydaotao.backend.classmanagement.dto.request.ClassSearchRequest;
import com.quanlydaotao.backend.classmanagement.entity.Class;
import jakarta.persistence.criteria.Predicate;
import org.springframework.data.jpa.domain.Specification;

import java.util.ArrayList;

public class ClassSpecification {

    public static Specification<Class> filterByCriteria(ClassSearchRequest request) {
        return (root, query, cb) -> {
            var predicates = new ArrayList<Predicate>();
            
            // Chỉ lấy bản ghi chưa xóa
            predicates.add(cb.isNull(root.get("deletedAt")));
            
            if (request.getClassCode() != null && !request.getClassCode().isEmpty()) {
                predicates.add(cb.like(root.get("classCode"), "%" + request.getClassCode() + "%"));
            }
            
            if (request.getClassName() != null && !request.getClassName().isEmpty()) {
                predicates.add(cb.like(root.get("className"), "%" + request.getClassName() + "%"));
            }
            
            if (request.getDepartmentId() != null && !request.getDepartmentId().isEmpty()) {
                predicates.add(cb.equal(root.get("departmentId"), request.getDepartmentId()));
            }
            
            if (request.getAdvisorId() != null && !request.getAdvisorId().isEmpty()) {
                predicates.add(cb.equal(root.get("advisorId"), request.getAdvisorId()));
            }
            
            if (request.getAcademicCohortId() != null && !request.getAcademicCohortId().isEmpty()) {
                predicates.add(cb.equal(root.get("academicCohortId"), request.getAcademicCohortId()));
            }
            
            if (request.getStatus() != null) {
                predicates.add(cb.equal(root.get("status"), request.getStatus()));
            }
            
            if (request.getIsActive() != null) {
                predicates.add(cb.equal(root.get("isActive"), request.getIsActive()));
            }
            
            return cb.and(predicates.toArray(new Predicate[0]));
        };
    }
}
package com.quanlydaotao.backend.semester.spec;

import com.quanlydaotao.backend.semester.dto.request.SemesterSearchRequest;
import com.quanlydaotao.backend.semester.entity.Semester;
import jakarta.persistence.criteria.Predicate;
import org.springframework.data.jpa.domain.Specification;

import java.util.ArrayList;

public class SemesterSpecification {
    
    public static Specification<Semester> filterByCriteria(SemesterSearchRequest request) {
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
            
            if (request.getStatus() != null) {
                predicates.add(cb.equal(root.get("status"), request.getStatus()));
            }
            
            if (request.getSchoolYearId() != null && !request.getSchoolYearId().isEmpty()) {
                predicates.add(cb.equal(root.get("schoolYear").get("schoolYearId"), request.getSchoolYearId()));
            }
            
            if (request.getIsActive() != null) {
                predicates.add(cb.equal(root.get("isActive"), request.getIsActive()));
            }
            
            if (request.getStartDateFrom() != null) {
                predicates.add(cb.greaterThanOrEqualTo(root.get("startDate"), request.getStartDateFrom()));
            }
            
            if (request.getStartDateTo() != null) {
                predicates.add(cb.lessThanOrEqualTo(root.get("startDate"), request.getStartDateTo()));
            }
            
            return cb.and(predicates.toArray(new Predicate[0]));
        };
    }
}
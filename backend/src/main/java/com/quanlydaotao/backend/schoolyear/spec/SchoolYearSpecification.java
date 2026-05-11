package com.quanlydaotao.backend.schoolyear.spec;

import com.quanlydaotao.backend.schoolyear.dto.request.SchoolYearSearchRequest;
import com.quanlydaotao.backend.schoolyear.entity.SchoolYear;
import jakarta.persistence.criteria.Predicate;
import org.springframework.data.jpa.domain.Specification;
import java.util.ArrayList;

public class SchoolYearSpecification {
    
    public static Specification<SchoolYear> filterByCriteria(SchoolYearSearchRequest request) {
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
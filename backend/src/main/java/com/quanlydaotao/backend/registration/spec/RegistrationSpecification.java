package com.quanlydaotao.backend.registration.spec;

import com.quanlydaotao.backend.registration.dto.request.RegistrationSearchRequest;
import com.quanlydaotao.backend.registration.entity.CourseRegistration;
import jakarta.persistence.criteria.Predicate;
import org.springframework.data.jpa.domain.Specification;

import java.util.ArrayList;

public class RegistrationSpecification {

    public static Specification<CourseRegistration> filterByCriteria(RegistrationSearchRequest request) {
        return (root, query, cb) -> {
            var predicates = new ArrayList<Predicate>();
            
            // Chỉ lấy bản ghi chưa xóa
            predicates.add(cb.isNull(root.get("deletedAt")));
            
            if (request.getStudentId() != null) {
                predicates.add(cb.equal(root.get("studentId"), request.getStudentId()));
            }
            
            if (request.getCourseClassId() != null) {
                predicates.add(cb.equal(root.get("courseClassId"), request.getCourseClassId()));
            }
            
            if (request.getRegistrationType() != null) {
                predicates.add(cb.equal(root.get("registrationType"), request.getRegistrationType()));
            }
            
            if (request.getStatus() != null) {
                predicates.add(cb.equal(root.get("status"), request.getStatus()));
            }
            
            if (request.getIsPaid() != null) {
                predicates.add(cb.equal(root.get("isPaid"), request.getIsPaid()));
            }
            
            return cb.and(predicates.toArray(new Predicate[0]));
        };
    }
}
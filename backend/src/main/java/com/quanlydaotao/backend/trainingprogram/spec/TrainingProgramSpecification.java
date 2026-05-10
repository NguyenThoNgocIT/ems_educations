package com.quanlydaotao.backend.trainingprogram.spec;

import com.quanlydaotao.backend.trainingprogram.dto.request.TrainingProgramSearchRequest;
import com.quanlydaotao.backend.trainingprogram.entity.TrainingProgram;
import jakarta.persistence.criteria.Predicate;
import org.springframework.data.jpa.domain.Specification;

import java.util.ArrayList;

public class TrainingProgramSpecification {

    public static Specification<TrainingProgram> filterByCriteria(TrainingProgramSearchRequest request) {
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
            
            if (request.getMajorId() != null && !request.getMajorId().isEmpty()) {
                predicates.add(cb.equal(root.get("majorId"), request.getMajorId()));
            }
            
            if (request.getDepartmentId() != null && !request.getDepartmentId().isEmpty()) {
                predicates.add(cb.equal(root.get("departmentId"), request.getDepartmentId()));
            }
            
            if (request.getAcademicCohortId() != null && !request.getAcademicCohortId().isEmpty()) {
                predicates.add(cb.equal(root.get("academicCohortId"), request.getAcademicCohortId()));
            }
            
            if (request.getDegreeLevel() != null && !request.getDegreeLevel().isEmpty()) {
                predicates.add(cb.equal(root.get("degreeLevel"), request.getDegreeLevel()));
            }
            
            if (request.getEducationType() != null && !request.getEducationType().isEmpty()) {
                predicates.add(cb.equal(root.get("educationType"), request.getEducationType()));
            }
            
            if (request.getIsActive() != null) {
                predicates.add(cb.equal(root.get("isActive"), request.getIsActive()));
            }
            
            return cb.and(predicates.toArray(new Predicate[0]));
        };
    }
}
package com.quanlydaotao.backend.user.specification;

import com.quanlydaotao.backend.user.dto.request.PersonSearchRequest;
import com.quanlydaotao.backend.user.entity.Person;
import org.springframework.data.jpa.domain.Specification;

public class PersonSpecification {

    private PersonSpecification() {
    }

    public static Specification<Person> search(PersonSearchRequest request) {

        return (root, query, criteriaBuilder) -> {

            var predicate = criteriaBuilder.conjunction();

            if (request.getKeyword() != null && !request.getKeyword().isBlank()) {

                String keyword = "%" + request.getKeyword().toLowerCase() + "%";

                predicate = criteriaBuilder.and(
                        predicate,
                        criteriaBuilder.or(
                                criteriaBuilder.like(
                                        criteriaBuilder.lower(root.get("fullName")),
                                        keyword
                                ),
                                criteriaBuilder.like(
                                        criteriaBuilder.lower(root.get("contactEmail")),
                                        keyword
                                ),
                                criteriaBuilder.like(
                                        criteriaBuilder.lower(root.get("phoneNumber")),
                                        keyword
                                )
                        )
                );
            }

            if (request.getGender() != null && !request.getGender().isBlank()) {
                predicate = criteriaBuilder.and(
                        predicate,
                        criteriaBuilder.equal(root.get("gender"), request.getGender())
                );
            }

            if (request.getIsActive() != null) {
                predicate = criteriaBuilder.and(
                        predicate,
                        criteriaBuilder.equal(root.get("isActive"), request.getIsActive())
                );
            }

            return predicate;
        };
    }
}
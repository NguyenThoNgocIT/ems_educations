package com.quanlydaotao.backend.graduationcondition;

import java.util.List;
import java.util.Optional;
import java.util.UUID;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface GraduationConditionRepository extends JpaRepository<GraduationCondition, UUID> {

    Optional<GraduationCondition> findByConditionCode(String conditionCode);

    Optional<GraduationCondition> findByIdAndIsActiveTrue(UUID id);

    List<GraduationCondition> findByIsActiveTrue();

    List<GraduationCondition> findByConditionCodeContainingIgnoreCaseOrConditionNameContainingIgnoreCaseAndIsActiveTrue(
            String conditionCode,
            String conditionName
    );

    List<GraduationCondition> findByStartDateLessThanEqualAndDueDateGreaterThanEqualAndIsActiveTrue(
            java.time.LocalDate date1,
            java.time.LocalDate date2
    );
}

package com.quanlydaotao.backend.administrativeclass.repository;

import com.quanlydaotao.backend.administrativeclass.entity.AdministrativeClass;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Repository
public interface AdministrativeClassRepository extends JpaRepository<AdministrativeClass, UUID> {
    Optional<AdministrativeClass> findByClassCode(String classCode);

    Optional<AdministrativeClass> findByAdvisorIdAndIsActiveTrue(UUID advisorId);

    @Query("""
            SELECT c
            FROM AdministrativeClass c
            WHERE (:keyword IS NULL OR LOWER(c.classCode) LIKE LOWER(CONCAT('%', :keyword, '%'))
                   OR LOWER(c.className) LIKE LOWER(CONCAT('%', :keyword, '%')))
              AND (:departmentId IS NULL OR c.departmentId = :departmentId)
              AND (:academicCohortId IS NULL OR c.academicCohortId = :academicCohortId)
              AND (:isActive IS NULL OR c.isActive = :isActive)
            ORDER BY c.classCode ASC
            """)
    List<AdministrativeClass> search(String keyword, UUID departmentId, UUID academicCohortId, Boolean isActive);
}

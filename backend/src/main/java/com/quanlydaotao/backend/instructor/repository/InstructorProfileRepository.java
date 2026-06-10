package com.quanlydaotao.backend.instructor.repository;

import com.quanlydaotao.backend.instructor.entity.InstructorProfile;
import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.Collection;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Repository
public interface InstructorProfileRepository extends JpaRepository<InstructorProfile, UUID> {
    Optional<InstructorProfile> findByInstructorCode(String instructorCode);

    List<InstructorProfile> findAllByIsActiveTrueAndDeletedAtIsNull();

    Optional<InstructorProfile> findByEmployeeEmployeeId(UUID employeeId);

    @EntityGraph(attributePaths = {"employee", "employee.person"})
    @Query("""
            SELECT i
            FROM InstructorProfile i
            WHERE i.employee.employeeId IN :employeeIds
              AND i.isActive = true
              AND i.deletedAt IS NULL
            """)
    List<InstructorProfile> findActiveByEmployeeIds(@Param("employeeIds") Collection<UUID> employeeIds);
}

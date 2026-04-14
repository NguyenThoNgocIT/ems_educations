package com.quanlydaotao.backend.semester;

import java.util.List;
import java.util.Optional;
import java.util.UUID;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

@Repository
public interface SemesterRepository extends JpaRepository<Semester, UUID> {

    Optional<Semester> findByCode(String code);

    Optional<Semester> findByIdAndIsActiveTrue(UUID id);

    List<Semester> findByIsActiveTrue();

    @Query("SELECT s FROM Semester s WHERE s.isActive = true AND (LOWER(s.code) LIKE LOWER(CONCAT('%', :term, '%')) OR LOWER(s.name) LIKE LOWER(CONCAT('%', :term, '%')) OR LOWER(s.academicYear) LIKE LOWER(CONCAT('%', :term, '%'))) ")
    List<Semester> searchActiveByAcademicYearOrName(@Param("term") String term);
}

package com.quanlydaotao.backend.semester.repository;

import com.quanlydaotao.backend.semester.entity.Semester;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Repository
public interface SemesterRepository extends JpaRepository<Semester, UUID> {
    Optional<Semester> findBySchoolYearIdAndCode(UUID schoolYearId, String code);

    @Query("""
            SELECT s
            FROM Semester s
            WHERE (:keyword IS NULL OR LOWER(s.code) LIKE LOWER(CONCAT('%', CAST(:keyword AS String), '%'))
                   OR LOWER(s.name) LIKE LOWER(CONCAT('%', CAST(:keyword AS String), '%')))
              AND (:schoolYearId IS NULL OR s.schoolYearId = :schoolYearId)
              AND (:status IS NULL OR s.status = :status)
              AND (:isActive IS NULL OR s.isActive = :isActive)
            ORDER BY s.startDate DESC, s.code ASC
            """)
    List<Semester> search(String keyword, UUID schoolYearId, Boolean status, Boolean isActive);
}

package com.quanlydaotao.backend.studentspecialization.repository;

import com.quanlydaotao.backend.studentspecialization.entity.StudentSpecializationHistory;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Repository
public interface StudentSpecializationHistoryRepository extends JpaRepository<StudentSpecializationHistory, UUID> {
    Optional<StudentSpecializationHistory> findByStudentIdAndIsCurrentTrueAndIsActiveTrue(UUID studentId);

    @Query("""
            SELECT h
            FROM StudentSpecializationHistory h
            WHERE (:studentId IS NULL OR h.studentId = :studentId)
              AND (:majorId IS NULL OR h.majorId = :majorId)
              AND (:specializationId IS NULL OR h.specializationId = :specializationId)
              AND (:isCurrent IS NULL OR h.isCurrent = :isCurrent)
              AND (:isActive IS NULL OR h.isActive = :isActive)
            ORDER BY h.startDate DESC, h.createdAt DESC
            """)
    List<StudentSpecializationHistory> search(UUID studentId, UUID majorId, UUID specializationId, Boolean isCurrent, Boolean isActive);
}

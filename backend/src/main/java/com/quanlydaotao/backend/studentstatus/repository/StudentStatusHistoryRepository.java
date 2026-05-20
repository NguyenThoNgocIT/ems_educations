package com.quanlydaotao.backend.studentstatus.repository;

import com.quanlydaotao.backend.studentstatus.entity.StudentStatusHistory;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Repository
public interface StudentStatusHistoryRepository extends JpaRepository<StudentStatusHistory, UUID> {
    List<StudentStatusHistory> findByStudentIdAndIsActiveTrueOrderByStartDateDesc(UUID studentId);

    Optional<StudentStatusHistory> findByStudentIdAndIsCurrentTrueAndIsActiveTrue(UUID studentId);

    @Query("""
            SELECT h
            FROM StudentStatusHistory h
            WHERE (:studentId IS NULL OR h.studentId = :studentId)
              AND (:studentStatusId IS NULL OR h.studentStatusId = :studentStatusId)
              AND (:isCurrent IS NULL OR h.isCurrent = :isCurrent)
              AND (:isActive IS NULL OR h.isActive = :isActive)
            ORDER BY h.startDate DESC, h.createdAt DESC
            """)
    List<StudentStatusHistory> search(UUID studentId, UUID studentStatusId, Boolean isCurrent, Boolean isActive);
}

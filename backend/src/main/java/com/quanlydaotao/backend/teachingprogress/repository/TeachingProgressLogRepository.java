package com.quanlydaotao.backend.teachingprogress.repository;

import com.quanlydaotao.backend.teachingprogress.entity.TeachingProgressLog;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.UUID;

@Repository
public interface TeachingProgressLogRepository extends JpaRepository<TeachingProgressLog, UUID> {
    List<TeachingProgressLog> findByCourseClassIdAndIsActiveTrue(UUID courseClassId);

    @Query("""
            SELECT COALESCE(SUM(l.actualPeriods), 0)
            FROM TeachingProgressLog l
            WHERE l.courseClassId = :courseClassId
              AND l.isActive = true
              AND (l.isInstructorAbsent IS NULL OR l.isInstructorAbsent = false)
            """)
    Integer sumTaughtPeriods(UUID courseClassId);

    @Query("""
            SELECT COUNT(l)
            FROM TeachingProgressLog l
            WHERE l.courseClassId = :courseClassId
              AND l.isActive = true
              AND l.isInstructorAbsent = true
            """)
    Long countInstructorAbsentSessions(UUID courseClassId);
}

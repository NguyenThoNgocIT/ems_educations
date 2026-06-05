package com.quanlydaotao.backend.scheduleadjustment.repository;

import com.quanlydaotao.backend.scheduleadjustment.entity.TeachingSessionOverride;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;
import java.util.UUID;

@Repository
public interface TeachingSessionOverrideRepository extends JpaRepository<TeachingSessionOverride, UUID> {
    List<TeachingSessionOverride> findByCourseClassIdInAndIsActiveTrue(List<UUID> courseClassIds);

    @Query("""
            SELECT o
            FROM TeachingSessionOverride o
            WHERE o.roomId = :roomId
              AND o.teachingDate = :date
              AND o.isActive = true
              AND o.isVisible = true
              AND o.status <> 'CANCELLED'
            """)
    List<TeachingSessionOverride> findVisibleByRoomAndDate(UUID roomId, LocalDate date);

    @Query("""
            SELECT o
            FROM TeachingSessionOverride o
            WHERE o.courseClassId = :courseClassId
              AND o.teachingDate = :date
              AND o.isActive = true
              AND o.isVisible = true
              AND o.status <> 'CANCELLED'
            """)
    List<TeachingSessionOverride> findVisibleByCourseClassAndDate(UUID courseClassId, LocalDate date);

    @Query("""
            SELECT o
            FROM TeachingSessionOverride o
            WHERE o.instructorId = :instructorId
              AND o.teachingDate = :date
              AND o.isActive = true
              AND o.isVisible = true
              AND o.status <> 'CANCELLED'
            """)
    List<TeachingSessionOverride> findVisibleByInstructorAndDate(UUID instructorId, LocalDate date);

    @Query("""
            SELECT o
            FROM TeachingSessionOverride o
            WHERE o.instructorId = :instructorId
              AND o.teachingDate BETWEEN :fromDate AND :toDate
              AND o.isActive = true
              AND o.isVisible = true
              AND o.status <> 'CANCELLED'
            ORDER BY o.teachingDate ASC
            """)
    List<TeachingSessionOverride> findVisibleByInstructorAndDateBetween(UUID instructorId, LocalDate fromDate, LocalDate toDate);

    @Query("""
            SELECT o
            FROM TeachingSessionOverride o
            WHERE o.instructorId = :instructorId
              AND o.teachingDate BETWEEN :fromDate AND :toDate
              AND o.isActive = true
            ORDER BY o.teachingDate ASC
            """)
    List<TeachingSessionOverride> findByInstructorAndDateBetween(UUID instructorId, LocalDate fromDate, LocalDate toDate);

    @Query("""
            SELECT o
            FROM TeachingSessionOverride o
            WHERE o.courseClassId = :courseClassId
              AND o.teachingDate BETWEEN :fromDate AND :toDate
              AND o.isActive = true
              AND o.isVisible = true
              AND o.status <> 'CANCELLED'
            ORDER BY o.teachingDate ASC
            """)
    List<TeachingSessionOverride> findVisibleByCourseClassAndDateBetween(UUID courseClassId, LocalDate fromDate, LocalDate toDate);

    @Query("""
            SELECT COUNT(o)
            FROM TeachingSessionOverride o
            WHERE o.courseClassId = :courseClassId
              AND o.isActive = true
              AND o.overrideType = 'CANCELLED'
            """)
    Long countCancelledSessions(UUID courseClassId);

    @Query("""
            SELECT COUNT(o) > 0
            FROM TeachingSessionOverride o
            WHERE o.roomId = :roomId
              AND o.teachingDate = :date
              AND o.timeSlotId = :timeSlotId
              AND o.isActive = true
              AND o.isVisible = true
              AND o.status <> 'CANCELLED'
            """)
    boolean hasRoomConflict(UUID roomId, LocalDate date, UUID timeSlotId);

    @Query("""
            SELECT COUNT(o) > 0
            FROM TeachingSessionOverride o
            WHERE o.instructorId = :instructorId
              AND o.teachingDate = :date
              AND o.timeSlotId = :timeSlotId
              AND o.isActive = true
              AND o.isVisible = true
              AND o.status <> 'CANCELLED'
            """)
    boolean hasInstructorConflict(UUID instructorId, LocalDate date, UUID timeSlotId);
}

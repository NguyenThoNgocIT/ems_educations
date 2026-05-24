package com.quanlydaotao.backend.scheduleadjustment.repository;

import com.quanlydaotao.backend.scheduleadjustment.entity.TeachingSessionOverride;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.UUID;

@Repository
public interface TeachingSessionOverrideRepository extends JpaRepository<TeachingSessionOverride, UUID> {
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

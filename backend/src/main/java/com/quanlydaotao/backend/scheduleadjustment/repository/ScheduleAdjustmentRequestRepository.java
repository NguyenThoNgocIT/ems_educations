package com.quanlydaotao.backend.scheduleadjustment.repository;

import com.quanlydaotao.backend.scheduleadjustment.entity.ScheduleAdjustmentRequest;
import jakarta.persistence.LockModeType;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Lock;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Repository
public interface ScheduleAdjustmentRequestRepository extends JpaRepository<ScheduleAdjustmentRequest, UUID> {
    List<ScheduleAdjustmentRequest> findByRequestedByInstructorIdAndIsActiveTrue(UUID instructorId);

    @Lock(LockModeType.PESSIMISTIC_WRITE)
    @Query("SELECT r FROM ScheduleAdjustmentRequest r WHERE r.requestId = :requestId")
    Optional<ScheduleAdjustmentRequest> findByIdForUpdate(UUID requestId);

    @Query("""
            SELECT COUNT(r) > 0
            FROM ScheduleAdjustmentRequest r
            WHERE r.originalScheduleId = :originalScheduleId
              AND r.isActive = true
              AND r.status IN ('PENDING','APPROVED','CONFLICT_DETECTED')
            """)
    boolean hasActiveRequestForOriginalSchedule(UUID originalScheduleId);

    @Query("""
            SELECT COUNT(r) > 0
            FROM ScheduleAdjustmentRequest r
            WHERE r.proposedRoomId = :roomId
              AND r.proposedDate = :date
              AND r.proposedTimeSlotId = :timeSlotId
              AND r.isActive = true
              AND r.status IN ('PENDING','APPROVED','CONFLICT_DETECTED')
              AND (:ignoredRequestId IS NULL OR r.requestId <> :ignoredRequestId)
            """)
    boolean hasRoomHold(UUID roomId, LocalDate date, UUID timeSlotId, UUID ignoredRequestId);

    @Query("""
            SELECT r
            FROM ScheduleAdjustmentRequest r
            WHERE (:status IS NULL OR r.status = :status)
              AND (:courseClassId IS NULL OR r.courseClassId = :courseClassId)
              AND (:instructorId IS NULL OR r.requestedByInstructorId = :instructorId)
              AND r.isActive = true
            ORDER BY r.createdAt DESC
            """)
    List<ScheduleAdjustmentRequest> search(String status, UUID courseClassId, UUID instructorId);
}

package com.quanlydaotao.backend.scheduleadjustment.entity;

import com.quanlydaotao.backend.infrastructure.persistence.base.SoftDeleteEntity;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.UUID;

@Entity
@Table(name = "ScheduleAdjustmentRequests")
@Getter
@Setter
public class ScheduleAdjustmentRequest extends SoftDeleteEntity {
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    @Column(name = "RequestId", columnDefinition = "uniqueidentifier", updatable = false, nullable = false)
    private UUID requestId;

    @Column(name = "CourseClassId", nullable = false, columnDefinition = "uniqueidentifier")
    private UUID courseClassId;

    @Column(name = "OriginalScheduleId", columnDefinition = "uniqueidentifier")
    private UUID originalScheduleId;

    @Column(name = "RequestedByInstructorId", nullable = false, columnDefinition = "uniqueidentifier")
    private UUID requestedByInstructorId;

    @Column(name = "RequestType", nullable = false, length = 30)
    private String requestType;

    @Column(name = "AbsentDate")
    private LocalDate absentDate;

    @Column(name = "AbsentTimeSlotId", columnDefinition = "uniqueidentifier")
    private UUID absentTimeSlotId;

    @Column(name = "AbsentPeriods")
    private Integer absentPeriods;

    @Column(name = "ProposedDate")
    private LocalDate proposedDate;

    @Column(name = "ProposedTimeSlotId", columnDefinition = "uniqueidentifier")
    private UUID proposedTimeSlotId;

    @Column(name = "ProposedRoomId", columnDefinition = "uniqueidentifier")
    private UUID proposedRoomId;

    @Column(name = "ProposedPeriods")
    private Integer proposedPeriods;

    @Column(name = "Reason", nullable = false, length = 500)
    private String reason;

    @Column(name = "Status", nullable = false, length = 30)
    private String status;

    @Column(name = "AdminNote", length = 500)
    private String adminNote;

    @Column(name = "ReviewedBy", columnDefinition = "uniqueidentifier")
    private UUID reviewedBy;

    @Column(name = "ReviewedAt")
    private LocalDateTime reviewedAt;
}

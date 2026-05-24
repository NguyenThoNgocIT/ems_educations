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
import java.util.UUID;

@Entity
@Table(name = "TeachingSessionOverrides")
@Getter
@Setter
public class TeachingSessionOverride extends SoftDeleteEntity {
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    @Column(name = "OverrideId", columnDefinition = "uniqueidentifier", updatable = false, nullable = false)
    private UUID overrideId;

    @Column(name = "RequestId", nullable = false, columnDefinition = "uniqueidentifier")
    private UUID requestId;

    @Column(name = "CourseClassId", nullable = false, columnDefinition = "uniqueidentifier")
    private UUID courseClassId;

    @Column(name = "OriginalScheduleId", columnDefinition = "uniqueidentifier")
    private UUID originalScheduleId;

    @Column(name = "OriginalDate")
    private LocalDate originalDate;

    @Column(name = "OverrideType", nullable = false, length = 30)
    private String overrideType;

    @Column(name = "TeachingDate", nullable = false)
    private LocalDate teachingDate;

    @Column(name = "TimeSlotId", columnDefinition = "uniqueidentifier")
    private UUID timeSlotId;

    @Column(name = "RoomId", columnDefinition = "uniqueidentifier")
    private UUID roomId;

    @Column(name = "InstructorId", columnDefinition = "uniqueidentifier")
    private UUID instructorId;

    @Column(name = "NumberOfPeriods")
    private Integer numberOfPeriods;

    @Column(name = "IsVisible")
    private Boolean isVisible = true;

    @Column(name = "Status", length = 30)
    private String status;

    @Column(name = "Note", length = 255)
    private String note;
}

package com.quanlydaotao.backend.teachingprogress.entity;

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
@Table(name = "TeachingProgressLogs")
@Getter
@Setter
public class TeachingProgressLog extends SoftDeleteEntity {
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    @Column(name = "TeachingProgressLogId", updatable = false, nullable = false)
    private UUID teachingProgressLogId;

    @Column(name = "CourseClassId", nullable = false)
    private UUID courseClassId;

    @Column(name = "ScheduleId")
    private UUID scheduleId;

    @Column(name = "InstructorId")
    private UUID instructorId;

    @Column(name = "TeachingDate", nullable = false)
    private LocalDate teachingDate;

    @Column(name = "PlannedPeriods")
    private Integer plannedPeriods;

    @Column(name = "ActualPeriods")
    private Integer actualPeriods;

    @Column(name = "IsInstructorAbsent")
    private Boolean isInstructorAbsent;

    @Column(name = "Status", length = 30)
    private String status;

    @Column(name = "Note", length = 255)
    private String note;
}

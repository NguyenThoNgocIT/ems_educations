package com.quanlydaotao.backend.scheduling.entity;

import com.quanlydaotao.backend.course.entity.CourseClass;
import com.quanlydaotao.backend.facility.entity.Room;
import com.quanlydaotao.backend.infrastructure.persistence.base.SoftDeleteEntity;
import com.quanlydaotao.backend.employee.entity.Employee;
import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.UUID;

@Entity
@Table(name = "Schedules")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Schedule extends SoftDeleteEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    @Column(name = "ScheduleId", columnDefinition = "uniqueidentifier", updatable = false, nullable = false)
    private UUID scheduleId;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "CourseClassId", nullable = false)
    private CourseClass courseClass;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "EmployeeId")
    private Employee instructor;

    @Column(name = "SemesterId", nullable = false)
    private UUID semesterId;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "RoomId", nullable = false)
    private Room room;

    @Column(name = "DayOfWeek", nullable = false)
    private Integer dayOfWeek;

    @Column(name = "Date")
    private LocalDate date;

    @Column(name = "Shift", length = 50)
    private String shift;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "TimeSlotId", nullable = false)
    private TimeSlot timeSlot;

    @Column(name = "NumberOfPeriods")
    private Integer numberOfPeriods;

    @Column(name = "StartDate")
    private LocalDateTime startDate;

    @Column(name = "EndDate")
    private LocalDateTime endDate;

    @Column(name = "Mode", length = 100)
    private String mode;

    @Column(name = "Status", length = 255)
    private String status;

    @Column(name = "ScheduleStatus", length = 50)
    private String scheduleStatus;

    @Column(name = "Note", length = 255)
    private String note;
}



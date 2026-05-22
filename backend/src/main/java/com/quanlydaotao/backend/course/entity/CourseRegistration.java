package com.quanlydaotao.backend.course.entity;

import com.quanlydaotao.backend.infrastructure.persistence.base.SoftDeleteEntity;
import com.quanlydaotao.backend.student.entity.Student;
import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;
import java.util.UUID;

@Entity
@Table(name = "CourseRegistrations")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class CourseRegistration extends SoftDeleteEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    @Column(name = "CourseRegistrationId", columnDefinition = "uniqueidentifier", updatable = false, nullable = false)
    private UUID courseRegistrationId;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "StudentId", nullable = false, insertable = false, updatable = false)
    private Student student;

    @Column(name = "StudentId", nullable = false)
    private UUID studentId;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "CourseClassId", nullable = false, insertable = false, updatable = false)
    private CourseClass courseClass;

    @Column(name = "CourseClassId", nullable = false)
    private UUID courseClassId;

    @Column(name = "RegistrationPeriodId", nullable = false)
    private UUID registrationPeriodId;

    @Column(name = "RegistrationType")
    private Integer registrationType;

    @Column(name = "ReplacedGradeId")
    private UUID replacedGradeId;

    @Column(name = "RegisteredAt")
    private LocalDateTime registeredAt;

    @Column(name = "Status")
    private Integer status;

    @Column(name = "IsPaid")
    private Boolean isPaid;
}

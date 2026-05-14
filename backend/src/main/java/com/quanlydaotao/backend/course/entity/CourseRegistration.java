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
    @Column(name = "RegistrationId", columnDefinition = "uniqueidentifier", updatable = false, nullable = false)
    private UUID registrationId;

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

    @Column(name = "RegistrationDate")
    private LocalDateTime registrationDate;

    @Column(name = "Status", length = 20)
    private String status; // REGISTERED, CANCELLED, COMPLETED
}

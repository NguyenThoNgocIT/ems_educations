package com.quanlydaotao.backend.studentspecialization.entity;

import com.quanlydaotao.backend.infrastructure.persistence.base.SoftDeleteEntity;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDate;
import java.util.UUID;

@Entity
@Table(name = "StudentSpecializationHistories")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class StudentSpecializationHistory extends SoftDeleteEntity {
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    @Column(name = "StudentSpecializationHistoryId", updatable = false, nullable = false)
    private UUID studentSpecializationHistoryId;

    @Column(name = "StudentId", nullable = false)
    private UUID studentId;

    @Column(name = "MajorId", nullable = false)
    private UUID majorId;

    @Column(name = "SpecializationId", nullable = false)
    private UUID specializationId;

    @Column(name = "TrainingProgramId", nullable = false)
    private UUID trainingProgramId;

    @Column(name = "EffectiveSemesterId", nullable = false)
    private UUID effectiveSemesterId;

    @Column(name = "StartDate", nullable = false)
    private LocalDate startDate;

    @Column(name = "EndDate")
    private LocalDate endDate;

    @Column(name = "IsCurrent", nullable = false)
    private Boolean isCurrent = true;

    @Column(name = "Reason", length = 255)
    private String reason;
}

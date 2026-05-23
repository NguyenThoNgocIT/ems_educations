package com.quanlydaotao.backend.semester.entity;

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
@Table(name = "Semesters")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class Semester extends SoftDeleteEntity {
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    @Column(name = "SemesterId", updatable = false, nullable = false)
    private UUID semesterId;

    @Column(name = "Code", nullable = false, length = 30)
    private String code;

    @Column(name = "Name", nullable = false, length = 150)
    private String name;

    @Column(name = "SchoolYearId", nullable = false)
    private UUID schoolYearId;

    @Column(name = "StartDate", nullable = false)
    private LocalDate startDate;

    @Column(name = "EndDate", nullable = false)
    private LocalDate endDate;

    @Column(name = "Status")
    private Boolean status;

    @Column(name = "Description", columnDefinition = "TEXT")
    private String description;
}

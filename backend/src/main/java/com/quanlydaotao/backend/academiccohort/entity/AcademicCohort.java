package com.quanlydaotao.backend.academiccohort.entity;

import com.quanlydaotao.backend.infrastructure.persistence.base.SoftDeleteEntity;
import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDate;
import java.util.UUID;

@Entity
@Table(name = "AcademicCohorts")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class AcademicCohort extends SoftDeleteEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    @Column(name = "AcademicCohortId", columnDefinition = "uniqueidentifier", updatable = false, nullable = false)
    private UUID cohortId;

    @Column(name = "Code", nullable = false, unique = true, length = 20)
    private String code;

    @Column(name = "Name", nullable = false, length = 255)
    private String name;

    @Column(name = "StartYear", nullable = false)
    private Integer startYear;

    @Column(name = "EndYear", nullable = false)
    private Integer endYear;

    @Column(name = "StartDate")
    private LocalDate startDate;

    @Column(name = "EndDate")
    private LocalDate endDate;

    @Column(name = "Description", length = 255)
    private String description;
}

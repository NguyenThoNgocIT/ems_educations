package com.quanlydaotao.backend.schoolyear.entity;

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
@Table(name = "SchoolYears")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class SchoolYear extends SoftDeleteEntity {
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    @Column(name = "SchoolYearId", updatable = false, nullable = false)
    private UUID schoolYearId;

    @Column(name = "Code", nullable = false, length = 50)
    private String code;

    @Column(name = "Name", length = 100)
    private String name;

    @Column(name = "StartDate", nullable = false)
    private LocalDate startDate;

    @Column(name = "EndDate", nullable = false)
    private LocalDate endDate;

    @Column(name = "Description", length = 255)
    private String description;

    @Column(name = "SchoolYearName", length = 150)
    private String schoolYearName;

    @Column(name = "Note", length = 255)
    private String note;
}

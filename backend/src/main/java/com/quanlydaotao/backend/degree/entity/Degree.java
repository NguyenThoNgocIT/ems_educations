package com.quanlydaotao.backend.degree.entity;

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

import java.util.UUID;

@Entity
@Table(name = "Degrees")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class Degree extends SoftDeleteEntity {
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    @Column(name = "DegreeId", columnDefinition = "uniqueidentifier", updatable = false, nullable = false)
    private UUID degreeId;

    @Column(name = "Code", nullable = false, length = 20)
    private String code;

    @Column(name = "Name", nullable = false, length = 150)
    private String name;

    @Column(name = "Level")
    private Integer level;

    @Column(name = "AcademicRank", length = 20)
    private String academicRank;

    @Column(name = "Specialization", length = 150)
    private String specialization;

    @Column(name = "Institution", length = 200)
    private String institution;

    @Column(name = "GraduationYear")
    private Integer graduationYear;

    @Column(name = "MajorId", columnDefinition = "uniqueidentifier")
    private UUID majorId;
}

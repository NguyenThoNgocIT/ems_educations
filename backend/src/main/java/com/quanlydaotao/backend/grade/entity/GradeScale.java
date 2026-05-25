package com.quanlydaotao.backend.grade.entity;

import com.quanlydaotao.backend.infrastructure.persistence.base.SoftDeleteEntity;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import lombok.Getter;
import lombok.Setter;

import java.math.BigDecimal;
import java.util.UUID;

@Entity
@Table(name = "GradeScales")
@Getter
@Setter
public class GradeScale extends SoftDeleteEntity {
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    @Column(name = "GradeScaleId", updatable = false, nullable = false)
    private UUID gradeScaleId;

    @Column(name = "ScaleName", nullable = false, length = 100)
    private String scaleName;

    @Column(name = "MinScore", nullable = false)
    private BigDecimal minScore;

    @Column(name = "MaxScore", nullable = false)
    private BigDecimal maxScore;

    @Column(name = "LetterGrade", nullable = false, length = 2)
    private String letterGrade;

    @Column(name = "GpaValue", nullable = false)
    private BigDecimal gpaValue;

    @Column(name = "Description", length = 255)
    private String description;
}

package com.quanlydaotao.backend.grade.entity;

import com.quanlydaotao.backend.course.entity.Course;
import com.quanlydaotao.backend.infrastructure.persistence.base.SoftDeleteEntity;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import lombok.Getter;
import lombok.Setter;

import java.math.BigDecimal;
import java.util.UUID;

@Entity
@Table(name = "GradeComponents")
@Getter
@Setter
public class GradeComponent extends SoftDeleteEntity {
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    @Column(name = "GradeComponentId", updatable = false, nullable = false)
    private UUID gradeComponentId;

    @Column(name = "CourseId", nullable = false)
    private UUID courseId;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "CourseId", insertable = false, updatable = false)
    private Course course;

    @Column(name = "ComponentCode", nullable = false, length = 20)
    private String componentCode;

    @Column(name = "ComponentName", nullable = false, length = 100)
    private String componentName;

    @Column(name = "WeightPercentage")
    private BigDecimal weightPercentage;

    @Column(name = "MinScore")
    private BigDecimal minScore;

    @Column(name = "MaxScore")
    private BigDecimal maxScore;

    @Column(name = "IsRequired")
    private Boolean isRequired;

    @Column(name = "InputOrder")
    private Integer inputOrder;

    @Column(name = "Description", length = 255)
    private String description;
}

package com.quanlydaotao.backend.grade.entity;

import com.quanlydaotao.backend.course.entity.CourseRegistration;
import com.quanlydaotao.backend.infrastructure.persistence.base.SoftDeleteEntity;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.MapsId;
import jakarta.persistence.OneToOne;
import jakarta.persistence.Table;
import lombok.Getter;
import lombok.Setter;

import java.math.BigDecimal;
import java.util.UUID;

@Entity
@Table(name = "StudentSummaries")
@Getter
@Setter
public class StudentSummary extends SoftDeleteEntity {
    @Id
    @Column(name = "CourseRegistrationId", nullable = false)
    private UUID courseRegistrationId;

    @OneToOne(fetch = FetchType.LAZY)
    @MapsId
    @JoinColumn(name = "CourseRegistrationId")
    private CourseRegistration courseRegistration;

    @Column(name = "TotalScore")
    private BigDecimal totalScore;

    @Column(name = "GradeScaleId")
    private UUID gradeScaleId;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "GradeScaleId", insertable = false, updatable = false)
    private GradeScale gradeScale;

    @Column(name = "LetterGrade", length = 2)
    private String letterGrade;

    @Column(name = "GpaValue")
    private BigDecimal gpaValue;

    @Column(name = "Result", length = 10)
    private String result;

    @Column(name = "IsFinalized")
    private Boolean isFinalized;
}

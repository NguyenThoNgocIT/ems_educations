package com.quanlydaotao.backend.grade.entity;

import com.quanlydaotao.backend.course.entity.CourseRegistration;
import com.quanlydaotao.backend.infrastructure.persistence.base.SoftDeleteEntity;
import jakarta.persistence.Column;
import jakarta.persistence.EmbeddedId;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.MapsId;
import jakarta.persistence.Table;
import lombok.Getter;
import lombok.Setter;

import java.math.BigDecimal;

@Entity
@Table(name = "StudentGrades")
@Getter
@Setter
public class StudentComponentGrade extends SoftDeleteEntity {
    @EmbeddedId
    private StudentComponentGradeId id;

    @ManyToOne(fetch = FetchType.LAZY)
    @MapsId("courseRegistrationId")
    @JoinColumn(name = "CourseRegistrationId")
    private CourseRegistration courseRegistration;

    @ManyToOne(fetch = FetchType.LAZY)
    @MapsId("gradeComponentId")
    @JoinColumn(name = "GradeComponentId")
    private GradeComponent gradeComponent;

    @Column(name = "Score")
    private BigDecimal score;

    @Column(name = "IsLocked")
    private Boolean isLocked;

    @Column(name = "Note", length = 255)
    private String note;
}

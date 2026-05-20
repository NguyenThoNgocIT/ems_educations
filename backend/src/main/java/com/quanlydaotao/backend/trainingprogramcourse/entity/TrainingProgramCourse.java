package com.quanlydaotao.backend.trainingprogramcourse.entity;

import com.quanlydaotao.backend.infrastructure.persistence.base.SoftDeleteEntity;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.IdClass;
import jakarta.persistence.Table;
import lombok.Getter;
import lombok.Setter;

import java.math.BigDecimal;
import java.util.UUID;

@Entity
@Table(name = "TrainingProgramCourses")
@IdClass(TrainingProgramCourseId.class)
@Getter
@Setter
public class TrainingProgramCourse extends SoftDeleteEntity {
    @Id
    @Column(name = "TrainingProgramId", columnDefinition = "uniqueidentifier")
    private UUID trainingProgramId;

    @Id
    @Column(name = "CourseId", columnDefinition = "uniqueidentifier")
    private UUID courseId;

    @Column(name = "SemesterId", columnDefinition = "uniqueidentifier")
    private UUID semesterId;

    @Column(name = "IsRequired")
    private Boolean isRequired;

    @Column(name = "GroupCode", length = 50)
    private String groupCode;

    @Column(name = "Credits", precision = 5, scale = 1)
    private BigDecimal credits;

    @Column(name = "PrerequisiteCourseId", columnDefinition = "uniqueidentifier")
    private UUID prerequisiteCourseId;

    @Column(name = "IsPrerequisiteRequired")
    private Boolean isPrerequisiteRequired;

    @Column(name = "Note", length = 500)
    private String note;

    @Column(name = "SortOrder")
    private Integer sortOrder;

    @Column(name = "Status", length = 50)
    private String status;

    @Column(name = "CoursePhase", length = 30)
    private String coursePhase;
}

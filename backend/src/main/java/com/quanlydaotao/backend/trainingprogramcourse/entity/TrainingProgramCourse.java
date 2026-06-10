package com.quanlydaotao.backend.trainingprogramcourse.entity;

import com.quanlydaotao.backend.infrastructure.persistence.base.SoftDeleteEntity;
import com.quanlydaotao.backend.course.entity.Course;
import com.quanlydaotao.backend.semester.entity.Semester;
import com.quanlydaotao.backend.trainingprogram.entity.TrainingProgram;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.Id;
import jakarta.persistence.IdClass;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
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
    @Column(name = "TrainingProgramId")
    private UUID trainingProgramId;

    @Id
    @Column(name = "CourseId")
    private UUID courseId;

    @Column(name = "SemesterId")
    private UUID semesterId;

    @Column(name = "IsRequired")
    private Boolean isRequired;

    @Column(name = "GroupCode", length = 50)
    private String groupCode;

    @Column(name = "Credits", precision = 5, scale = 1)
    private BigDecimal credits;

    @Column(name = "PrerequisiteCourseId")
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

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "TrainingProgramId", insertable = false, updatable = false)
    private TrainingProgram trainingProgram;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "CourseId", insertable = false, updatable = false)
    private Course course;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "SemesterId", insertable = false, updatable = false)
    private Semester semester;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "PrerequisiteCourseId", insertable = false, updatable = false)
    private Course prerequisiteCourse;
}

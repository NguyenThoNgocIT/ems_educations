package com.quanlydaotao.backend.course.entity;

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

import java.math.BigDecimal;
import java.util.UUID;

@Entity
@Table(name = "Courses")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class Course extends SoftDeleteEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    @Column(name = "CourseId", columnDefinition = "uniqueidentifier", updatable = false, nullable = false)
    private UUID courseId;

    @Column(name = "DepartmentId")
    private UUID departmentId;

    @Column(name = "Code", nullable = false, unique = true, length = 20)
    private String code;

    @Column(name = "Name", nullable = false, length = 200)
    private String name;

    @Column(name = "NameEn", length = 255)
    private String nameEn;

    @Column(name = "CourseType", length = 20)
    private String courseType;

    @Column(name = "Credits", nullable = false, precision = 5, scale = 1)
    private BigDecimal credits;

    @Column(name = "TheoryHours", precision = 5, scale = 1)
    private BigDecimal theoryHours;

    @Column(name = "PracticeHours", precision = 5, scale = 1)
    private BigDecimal practiceHours;

    @Column(name = "SelfStudyHours", precision = 5, scale = 1)
    private BigDecimal selfStudyHours;

    @Column(name = "InternshipCredits", precision = 5, scale = 1)
    private BigDecimal internshipCredits;

    @Column(name = "Description", length = 1000)
    private String description;
}


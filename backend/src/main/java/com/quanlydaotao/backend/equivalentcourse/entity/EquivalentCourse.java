package com.quanlydaotao.backend.equivalentcourse.entity;

import com.quanlydaotao.backend.infrastructure.persistence.base.SoftDeleteEntity;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import lombok.Getter;
import lombok.Setter;

import java.util.UUID;

@Entity
@Table(name = "EquivalentCourses")
@Getter
@Setter
public class EquivalentCourse extends SoftDeleteEntity {
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    @Column(name = "EquivalentCoursesId", updatable = false, nullable = false)
    private UUID equivalentCoursesId;

    @Column(name = "OriginalCourseId", nullable = false)
    private UUID originalCourseId;

    @Column(name = "EquivalentCourseId", nullable = false)
    private UUID equivalentCourseId;
}

package com.quanlydaotao.backend.teachingassignment.entity;

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
@Table(name = "TeachingAssignments")
@Getter
@Setter
public class TeachingAssignment extends SoftDeleteEntity {
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    @Column(name = "AssignmentId", updatable = false, nullable = false)
    private UUID assignmentId;

    @Column(name = "InstructorId", nullable = false)
    private UUID instructorId;

    @Column(name = "CourseClassId", nullable = false)
    private UUID courseClassId;

    @Column(name = "ClassId", nullable = false)
    private UUID classId;

    @Column(name = "SemesterId", nullable = false)
    private UUID semesterId;

    @Column(name = "Note", length = 255)
    private String note;
}

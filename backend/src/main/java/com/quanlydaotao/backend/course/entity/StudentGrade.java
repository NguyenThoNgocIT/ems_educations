package com.quanlydaotao.backend.course.entity;

import com.quanlydaotao.backend.infrastructure.persistence.base.SoftDeleteEntity;
import com.quanlydaotao.backend.student.entity.Student;
import jakarta.persistence.*;
import lombok.*;

import java.util.UUID;

@Entity
@Table(name = "StudentGrades")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class StudentGrade extends SoftDeleteEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    @Column(name = "GradeId", updatable = false, nullable = false)
    private UUID gradeId;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "StudentId", nullable = false, insertable = false, updatable = false)
    private Student student;

    @Column(name = "StudentId", nullable = false)
    private UUID studentId;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "CourseId", nullable = false, insertable = false, updatable = false)
    private Course course;

    @Column(name = "CourseId", nullable = false)
    private UUID courseId;

    @Column(name = "Grade")
    private Double grade;

    @Column(name = "Status", length = 20)
    private String status; // PASSED, FAILED, IN_PROGRESS
}

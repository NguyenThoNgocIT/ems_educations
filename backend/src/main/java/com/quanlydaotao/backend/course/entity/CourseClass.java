package com.quanlydaotao.backend.course.entity;

import com.quanlydaotao.backend.infrastructure.persistence.base.SoftDeleteEntity;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDate;
import java.util.UUID;

@Entity
@Table(name = "CourseClasses", uniqueConstraints = {
    @UniqueConstraint(columnNames = {"SemesterId", "CourseId", "ClassCode"})
})
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class CourseClass extends SoftDeleteEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    @Column(name = "CourseClassId", columnDefinition = "uniqueidentifier", updatable = false, nullable = false)
    private UUID courseClassId;

    @Column(name = "ClassCode", nullable = false, length = 50)
    private String classCode;

    @Column(name = "MaxStudent")
    private Integer maxStudent;

    @Column(name = "CurrentStudent")
    private Integer currentStudent;

    @Column(name = "RoomId")
    private UUID roomId;

    @Column(name = "Status", length = 20)
    private String status;

    @Column(name = "StartDate")
    private LocalDate startDate;

    @Column(name = "EndDate")
    private LocalDate endDate;

    @Column(name = "SemesterId", nullable = false)
    private UUID semesterId;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "CourseId", nullable = false, insertable = false, updatable = false)
    private Course course;

    @Column(name = "CourseId", nullable = false)
    private UUID courseId;
}


package com.quanlydaotao.backend.course.entity;

import com.quanlydaotao.backend.infrastructure.persistence.base.SoftDeleteEntity;
import jakarta.persistence.*;
import lombok.*;

import java.util.UUID;

@Entity
@Table(name = "TrainingPrograms")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class TrainingProgram extends SoftDeleteEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    @Column(name = "TrainingProgramId", columnDefinition = "uniqueidentifier", updatable = false, nullable = false)
    private UUID programId;

    @Column(name = "Code", nullable = false, unique = true, length = 50)
    private String programCode;

    @Column(name = "Name", nullable = false, length = 255)
    private String programName;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "MajorId", nullable = false)
    private Major major;

    @Transient
    private String academicYear;

    @Column(name = "DepartmentId", columnDefinition = "uniqueidentifier")
    private UUID departmentId;

    @Column(name = "AcademicCohortId", columnDefinition = "uniqueidentifier")
    private UUID academicCohortId;

    @Column(name = "TotalCredits", nullable = false)
    private Integer totalCredits;

    @Column(name = "Description", columnDefinition = "nvarchar(max)")
    private String description;

    @Transient
    private String note;

    @Column(name = "Status")
    private Integer status = 1;
}

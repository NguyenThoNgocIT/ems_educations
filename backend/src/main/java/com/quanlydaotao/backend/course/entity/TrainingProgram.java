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
    @Column(name = "ProgramId", columnDefinition = "uniqueidentifier", updatable = false, nullable = false)
    private UUID programId;

    @Column(name = "ProgramCode", nullable = false, unique = true, length = 50)
    private String programCode;

    @Column(name = "ProgramName", nullable = false, length = 255)
    private String programName;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "MajorId", nullable = false)
    private Major major;

    @Column(name = "AcademicYear", nullable = false, length = 20)
    private String academicYear;

    @Column(name = "TotalCredits", nullable = false)
    private Integer totalCredits;

    @Column(name = "Description", columnDefinition = "nvarchar(max)")
    private String description;

    @Column(name = "Note", length = 500)
    private String note;

    @Column(name = "Status")
    private Integer status = 1;
}

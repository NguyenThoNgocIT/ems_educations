package com.quanlydaotao.backend.trainingprogram.entity;

import com.quanlydaotao.backend.infrastructure.persistence.base.SoftDeleteEntity;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.math.BigDecimal;
import java.time.LocalDate;
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
    private UUID trainingProgramId;

    @Column(name = "Code", length = 50)
    private String code;

    @Column(name = "Name", length = 255)
    private String name;


    @Column(name = "NameEn", length = 255)
    private String nameEn;

    @Column(name = "MajorId")
    private UUID majorId;

    @Column(name = "SpecializationId")
    private UUID specializationId;

    @Column(name = "DepartmentId")
    private UUID departmentId;

    @Column(name = "AcademicCohortId")
    private UUID academicCohortId;

    @Column(name = "DegreeLevel", length = 50)
    private String degreeLevel;

    @Column(name = "EducationType", length = 50)
    private String educationType;

    @Column(name = "TotalCredits")

    private Integer totalCredits;

    @Column(name = "RequiredCredits", precision = 5, scale = 1)
    private BigDecimal requiredCredits;

    @Column(name = "ElectiveCredits", precision = 5, scale = 1)
    private BigDecimal electiveCredits;

    @Column(name = "InternshipCredits", precision = 5, scale = 1)
    private BigDecimal internshipCredits;

    @Column(name = "ThesisCredits", precision = 5, scale = 1)
    private BigDecimal thesisCredits;

    @Column(name = "AdmissionYear")
    private LocalDate admissionYear;

    @Column(name = "DurationYears", precision = 5, scale = 1)
    private BigDecimal durationYears;

    @Column(name = "MaxDurationYears", precision = 5, scale = 1)
    private BigDecimal maxDurationYears;

    @Column(name = "EffectiveDate")
    private LocalDate effectiveDate;

    @Column(name = "ExpiryDate")
    private LocalDate expiryDate;

    @Column(name = "Description", columnDefinition = "NVARCHAR(MAX)")
    private String description;

    @Column(name = "Objectives", columnDefinition = "NVARCHAR(MAX)")
    private String objectives;


    @Column(name = "LearningOutcomes", columnDefinition = "NVARCHAR(MAX)")
    private String learningOutcomes;

    @Column(name = "Version", length = 20)
    private String version;

    @Column(name = "Status", length = 50)
    private String status;

    @Column(name = "ProgramPhase", length = 30)
    private String programPhase;
}

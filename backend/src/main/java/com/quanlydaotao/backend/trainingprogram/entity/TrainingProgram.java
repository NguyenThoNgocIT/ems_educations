package com.quanlydaotao.backend.trainingprogram.entity;

import com.quanlydaotao.backend.infrastructure.persistence.base.BaseEntity;
import jakarta.persistence.*;
import lombok.*;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.UUID;

@Entity
@Table(name = "TrainingPrograms", uniqueConstraints = {
    @UniqueConstraint(name = "UK_TrainingProgram_Code", columnNames = "Code")
})
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class TrainingProgram extends BaseEntity {
    
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    @Column(name = "TrainingProgramId", columnDefinition = "uniqueidentifier", updatable = false, nullable = false)
    private UUID trainingProgramId;
    
    @Column(name = "Code", nullable = false, unique = true, length = 20)
    private String code;
    
    @Column(name = "Name", nullable = false, length = 255)
    private String name;
    
    @Column(name = "NameEn", length = 255)
    private String nameEn;
    
    @Column(name = "MajorId", nullable = false, length = 36)
    private String majorId;
    
    @Column(name = "DepartmentId", nullable = false, length = 36)
    private String departmentId;
    
    @Column(name = "AcademicCohortId", nullable = false, length = 36)
    private String academicCohortId;
    
    @Column(name = "DegreeLevel", length = 50)
    private String degreeLevel;
    
    @Column(name = "EducationType", length = 50)
    private String educationType;
    
    @Column(name = "TotalCredits")
    private Integer totalCredits;
    
    @Column(name = "required_credits", precision = 5, scale = 1)
    private BigDecimal requiredCredits;
    
    @Column(name = "elective_credits", precision = 5, scale = 1)
    private BigDecimal electiveCredits;
    
    @Column(name = "internship_credits", precision = 5, scale = 1)
    private BigDecimal internshipCredits;
    
    @Column(name = "thesis_credits", precision = 5, scale = 1)
    private BigDecimal thesisCredits;
    
    @Column(name = "admission_year")
    private LocalDate admissionYear;
    
    @Column(name = "duration_years", precision = 5, scale = 1)
    private BigDecimal durationYears;
    
    @Column(name = "max_duration_years", precision = 5, scale = 1)
    private BigDecimal maxDurationYears;
    
    @Column(name = "effective_date")
    private LocalDate effectiveDate;
    
    @Column(name = "expiry_date")
    private LocalDate expiryDate;
    
    @Column(name = "Description", columnDefinition = "NVARCHAR(MAX)")
    private String description;
    
    @Builder.Default
    @Column(name = "IsActive", nullable = false)
    private Boolean isActive = true;
}
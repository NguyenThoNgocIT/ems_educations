package com.quanlydaotao.backend.graduationcondition;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.UUID;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@Table(name = "graduation_conditions")
@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class GraduationCondition {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @NotBlank
    @Column(name = "condition_code", nullable = false, unique = true)
    private String conditionCode;

    @NotBlank
    @Column(name = "condition_name", nullable = false)
    private String conditionName;

    @NotNull
    @Column(name = "min_credits", nullable = false)
    private Integer minCredits;

    @NotNull
    @Column(name = "min_gpa", nullable = false)
    private Double minGpa;

    @NotNull
    @Column(name = "max_failed_courses", nullable = false)
    private Integer maxFailedCourses;

    @Column(name = "required_certificate")
    private String requiredCertificate;

    @Column(columnDefinition = "TEXT")
    private String description;

    @NotNull
    @Column(name = "start_date", nullable = false)
    private LocalDate startDate;

    @NotNull
    @Column(name = "due_date", nullable = false)
    private LocalDate dueDate;

    @Column(name = "created_at", nullable = false, updatable = false)
    private LocalDateTime createdAt;

    @Column(name = "updated_at")
    private LocalDateTime updatedAt;

    @Column(name = "created_by")
    private UUID createdBy;

    @Column(name = "updated_by")
    private UUID updatedBy;

    @Column(name = "deleted_at")
    private LocalDateTime deletedAt;

    @Column(name = "deleted_by")
    private UUID deletedBy;

    @Column(name = "is_active", nullable = false)
    private Boolean isActive;

    @PrePersist
    public void prePersist() {
        this.createdAt = LocalDateTime.now();
        this.isActive = true;
    }

    @PreUpdate
    public void preUpdate() {
        this.updatedAt = LocalDateTime.now();
    }
}

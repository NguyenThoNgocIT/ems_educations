package com.quanlydaotao.backend.graduationresult;

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
@Table(name = "graduation_results")
@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class GraduationResult {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @NotNull
    @Column(name = "student_id", nullable = false)
    private UUID studentId;

    @NotNull
    @Column(name = "condition_id", nullable = false)
    private UUID conditionId;

    @NotNull
    @Column(name = "total_credits", nullable = false)
    private Integer totalCredits;

    @NotNull
    @Column(nullable = false)
    private Double gpa;

    @NotNull
    @Column(name = "failed_courses", nullable = false)
    private Integer failedCourses;

    @NotBlank
    @Column(name = "graduation_status", nullable = false)
    private String graduationStatus;

    @Column(name = "graduation_rank")
    private String graduationRank;

    @Column(name = "decision_number")
    private String decisionNumber;

    @Column(name = "decision_date")
    private LocalDate decisionDate;

    @Column(name = "start_date")
    private LocalDate startDate;

    @Column(name = "due_date")
    private LocalDate dueDate;

    @Column(name = "created_at", nullable = false, updatable = false)
    private LocalDateTime createdAt;

    @Column(name = "updated_at")
    private LocalDateTime updatedAt;

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

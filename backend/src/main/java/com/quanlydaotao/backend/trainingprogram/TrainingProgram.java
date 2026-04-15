package com.quanlydaotao.backend.trainingprogram;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import java.time.LocalDateTime;
import java.util.UUID;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "training_programs")
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class TrainingProgram {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @NotBlank
    @Column(name = "program_code", nullable = false, unique = true)
    private String programCode;

    @NotBlank
    @Column(name = "program_name", nullable = false)
    private String programName;

    @NotNull
    @Column(name = "major_id", nullable = false)
    private UUID majorId;

    @NotBlank
    @Column(name = "academic_year", nullable = false)
    private String academicYear;

    @NotNull
    @Column(name = "total_credits", nullable = false)
    private Integer totalCredits;

    @Column(columnDefinition = "TEXT")
    private String description;

    @NotNull
    @Column(nullable = false)
    private Boolean status;

    private String note;

    @Column(name = "approval_status")
    private String approvalStatus;

    @Column(name = "approval_comment", columnDefinition = "TEXT")
    private String approvalComment;

    @Column(name = "approved_at")
    private LocalDateTime approvedAt;

    @Column(name = "created_at", nullable = false, updatable = false)
    private LocalDateTime createdAt;

    @Column(name = "updated_at")
    private LocalDateTime updatedAt;

    @Column(name = "deleted_at")
    private LocalDateTime deletedAt;

    @Column(name = "is_active", nullable = false)
    private Boolean isActive;

    @PrePersist
    public void prePersist() {
        this.createdAt = LocalDateTime.now();
        if (this.approvalStatus == null) {
            this.approvalStatus = "DRAFT";
        }
        this.isActive = true;
    }

    @PreUpdate
    public void preUpdate() {
        this.updatedAt = LocalDateTime.now();
    }
}

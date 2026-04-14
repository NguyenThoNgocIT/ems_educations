package com.quanlydaotao.backend.gradescale;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import java.time.LocalDateTime;
import java.util.UUID;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@Table(name = "grade_scales")
@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class GradeScale {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @NotBlank
    @Column(name = "scale_name", nullable = false, unique = true)
    private String scaleName;

    @NotNull
    @Column(name = "min_score", nullable = false)
    private Double minScore;

    @NotNull
    @Column(name = "max_score", nullable = false)
    private Double maxScore;

    @NotBlank
    @Column(name = "grade_letter", nullable = false)
    private String gradeLetter;

    @NotNull
    @Column(name = "gpa_value", nullable = false)
    private Double gpaValue;

    @Column(columnDefinition = "TEXT")
    private String description;

    @Column(name = "created_at", nullable = false, updatable = false)
    private LocalDateTime createdAt;

    @Column(name = "updated_at")
    private LocalDateTime updatedAt;

    @Column(name = "deleted_at")
    private LocalDateTime deletedAt;

    @Column(name = "created_by")
    private UUID createdBy;

    @Column(name = "updated_by")
    private UUID updatedBy;

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

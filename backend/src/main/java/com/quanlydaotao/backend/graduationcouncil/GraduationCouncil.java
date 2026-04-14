package com.quanlydaotao.backend.graduationcouncil;

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
@Table(name = "graduation_councils")
@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class GraduationCouncil {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @NotBlank
    @Column(name = "council_code", nullable = false, unique = true)
    private String councilCode;

    @NotBlank
    @Column(name = "council_name", nullable = false)
    private String councilName;

    @NotBlank
    @Column(name = "school_year", nullable = false)
    private String schoolYear;

    @NotBlank
    @Column(nullable = false)
    private String semester;

    @NotBlank
    @Column(name = "decision_number", nullable = false)
    private String decisionNumber;

    @NotNull
    @Column(name = "decision_date", nullable = false)
    private LocalDate decisionDate;

    @Column(name = "chairman_id")
    private UUID chairmanId;

    @Column(name = "secretary_id")
    private UUID secretaryId;

    @Column(columnDefinition = "TEXT")
    private String description;

    @NotNull
    @Column(name = "start_date", nullable = false)
    private LocalDate startDate;

    @NotNull
    @Column(name = "end_date", nullable = false)
    private LocalDate endDate;

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

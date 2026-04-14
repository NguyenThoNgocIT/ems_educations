package com.quanlydaotao.backend.subject;

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
@Table(name = "subjects")
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class Subject {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @NotBlank
    @Column(name = "course_code", nullable = false, unique = true)
    private String courseCode;

    @NotBlank
    @Column(name = "course_name", nullable = false)
    private String courseName;

    @NotNull
    @Column(nullable = false)
    private Integer credits;

    @NotNull
    @Column(name = "theory_hours", nullable = false)
    private Integer theoryHours;

    @NotNull
    @Column(name = "practice_hours", nullable = false)
    private Integer practiceHours;

    @Column(columnDefinition = "TEXT")
    private String description;

    @NotNull
    @Column(nullable = false)
    private Integer semester;

    @NotNull
    @Column(name = "is_mandatory", nullable = false)
    private Boolean isMandatory;

    @NotNull
    @Column(name = "program_id", nullable = false)
    private UUID programId;

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
        this.isActive = true;
    }

    @PreUpdate
    public void preUpdate() {
        this.updatedAt = LocalDateTime.now();
    }
}

package com.quanlydaotao.backend.prerequisite;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotNull;
import java.time.LocalDateTime;
import java.util.UUID;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "course_prerequisites")
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class CoursePrerequisite {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @NotNull
    @Column(name = "course_id", nullable = false)
    private UUID courseId;

    @NotNull
    @Column(name = "prerequisite_id", nullable = false)
    private UUID prerequisiteId;

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

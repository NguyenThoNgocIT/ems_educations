package com.quanlydaotao.backend.course.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.hibernate.annotations.CreationTimestamp;

import java.time.LocalDateTime;
import java.util.UUID;

@Entity
@Table(name = "CoursePrerequisites")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@IdClass(CoursePrerequisiteId.class)
public class CoursePrerequisite {

    @Id
    @Column(name = "CourseId")
    private UUID courseId;

    @Id
    @Column(name = "PrerequisiteCourseId")
    private UUID prerequisiteCourseId;

    @Column(name = "Type")
    private String type; // PREREQUISITE, PARALLEL

    @Column(name = "IsActive", nullable = false)
    private Boolean isActive = true;

    @CreationTimestamp
    @Column(name = "CreatedAt", nullable = false)
    private LocalDateTime createdAt;

    @Column(name = "CreatedBy")
    private UUID createdBy;

    @Column(name = "UpdatedAt")
    private LocalDateTime updatedAt;

    @Column(name = "UpdatedBy")
    private UUID updatedBy;

    @Column(name = "DeletedAt")
    private LocalDateTime deletedAt;

    @Column(name = "DeletedBy")
    private UUID deletedBy;

    @PrePersist
    protected void onCreate() {
        if (createdAt == null) {
            createdAt = LocalDateTime.now();
        }
    }

    @PreUpdate
    protected void onUpdate() {
        updatedAt = LocalDateTime.now();
    }
}

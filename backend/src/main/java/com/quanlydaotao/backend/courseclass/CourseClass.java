package com.quanlydaotao.backend.courseclass;

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
@Table(name = "course_classes")
@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class CourseClass {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @NotNull
    @Column(name = "course_id", nullable = false)
    private UUID courseId;

    @NotNull
    @Column(name = "semester_id", nullable = false)
    private UUID semesterId;

    @NotBlank
    @Column(name = "class_code", nullable = false, unique = true)
    private String classCode;

    @NotNull
    @Column(name = "max_student", nullable = false)
    private Integer maxStudent;

    @Column(name = "current_student", nullable = false)
    private Integer currentStudent;

    @Column(columnDefinition = "TEXT")
    private String schedule;

    @Column(nullable = false)
    private String room;

    @NotNull
    @Column(nullable = false)
    private Integer status;

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
        if (this.currentStudent == null) {
            this.currentStudent = 0;
        }
    }

    @PreUpdate
    public void preUpdate() {
        this.updatedAt = LocalDateTime.now();
    }
}

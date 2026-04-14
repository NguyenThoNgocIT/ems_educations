package com.quanlydaotao.backend.schedule;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotNull;
import java.time.LocalDateTime;
import java.util.UUID;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@Table(name = "schedules")
@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class Schedule {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @NotNull
    @Column(name = "course_class_id", nullable = false)
    private UUID courseClassId;

    @NotNull
    @Column(name = "room_id", nullable = false)
    private UUID roomId;

    @NotNull
    @Column(name = "semester_id", nullable = false)
    private UUID semesterId;

    @NotNull
    @Column(name = "day_of_week", nullable = false)
    private Integer dayOfWeek;

    @NotNull
    @Column(name = "start_period", nullable = false)
    private Integer startPeriod;

    @NotNull
    @Column(name = "end_period", nullable = false)
    private Integer endPeriod;

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

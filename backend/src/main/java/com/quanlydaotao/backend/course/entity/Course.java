package com.quanlydaotao.backend.course.entity;

import com.quanlydaotao.backend.infrastructure.persistence.base.BaseEntity;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.math.BigDecimal;
import java.util.UUID;

@Entity
@Table(name = "Courses")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class Course extends BaseEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    @Column(name = "CourseId", columnDefinition = "uniqueidentifier", updatable = false, nullable = false)
    private UUID courseId;

    @Column(name = "DepartmentId")
    private UUID departmentId;

    @Column(name = "Code", nullable = false, unique = true, length = 20)
    private String code;

    @Column(name = "Name", nullable = false, length = 200)
    private String name;

    @Column(name = "NameEn", length = 255)
    private String nameEn;

    @Column(name = "CourseType", length = 20)
    private String courseType;

    @Column(name = "Credits", nullable = false)
    private Double credits;

    @Column(name = "TheoryHours")
    private Double theoryHours;

    @Column(name = "PracticeHours")
    private Double practiceHours;

    @Column(name = "SelfStudyHours")
    private Double selfStudyHours;

    @Column(name = "InternshipCredits")
    private Double internshipCredits;

    @Column(name = "Description", length = 1000)
    private String description;

    @Column(name = "IsActive")
    private Boolean isActive;

    // Mapping chính xác cột DeleteAt/DeleteBy từ dbsql.md
    @Column(name = "DeleteAt")
    private java.time.LocalDateTime deletedAt;

    @Column(name = "DeleteBy")
    private UUID deletedBy;

    // Ghi đè các getter/setter để Hibernate không dùng tên mặc định DeletedAt/DeletedBy
    public java.time.LocalDateTime getDeletedAt() {
        return this.deletedAt;
    }

    public void setDeletedAt(java.time.LocalDateTime deletedAt) {
        this.deletedAt = deletedAt;
    }

    public UUID getDeletedBy() {
        return this.deletedBy;
    }

    public void setDeletedBy(UUID deletedBy) {
        this.deletedBy = deletedBy;
    }
}


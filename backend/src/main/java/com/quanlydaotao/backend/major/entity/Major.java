package com.quanlydaotao.backend.major.entity;

import com.quanlydaotao.backend.infrastructure.persistence.base.SoftDeleteEntity;
import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDate;
import java.util.UUID;

@Entity
@Table(name = "Majors")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class Major extends SoftDeleteEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    @Column(name = "MajorId", columnDefinition = "uniqueidentifier", updatable = false, nullable = false)
    private UUID majorId;

    @Column(name = "DepartmentId", columnDefinition = "uniqueidentifier")
    private UUID departmentId;

    @Column(name = "Code", nullable = false, unique = true, length = 20)
    private String code;

    @Column(name = "Name", nullable = false, length = 255)
    private String name;

    @Column(name = "Description", columnDefinition = "nvarchar(max)")
    private String description;

    @Column(name = "IsActive")
    private Boolean isActive;

    @Column(name = "EffectiveDate")
    private LocalDate effectiveDate;

    @Column(name = "ExpiryDate")
    private LocalDate expiryDate;
}
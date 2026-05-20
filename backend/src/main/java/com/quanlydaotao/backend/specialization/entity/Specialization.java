package com.quanlydaotao.backend.specialization.entity;

import com.quanlydaotao.backend.infrastructure.persistence.base.SoftDeleteEntity;
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

import java.util.UUID;

@Entity
@Table(name = "Specializations")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class Specialization extends SoftDeleteEntity {
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    @Column(name = "SpecializationId", columnDefinition = "uniqueidentifier", updatable = false, nullable = false)
    private UUID specializationId;

    @Column(name = "DepartmentId", nullable = false, columnDefinition = "uniqueidentifier")
    private UUID departmentId;

    @Column(name = "MajorId", nullable = false, columnDefinition = "uniqueidentifier")
    private UUID majorId;

    @Column(name = "Code", nullable = false, length = 50)
    private String code;

    @Column(name = "Name", nullable = false, length = 255)
    private String name;

    @Column(name = "Description", length = 500)
    private String description;
}

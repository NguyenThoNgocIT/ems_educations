package com.quanlydaotao.backend.department.entity;

import com.quanlydaotao.backend.infrastructure.persistence.base.SoftDeleteEntity;
import jakarta.persistence.*;
import lombok.*;

import java.util.UUID;

@Entity
@Table(name = "Departments")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class Department extends SoftDeleteEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    @Column(name = "DepartmentId", columnDefinition = "uniqueidentifier", updatable = false, nullable = false)
    private UUID departmentId;

    @Column(name = "Code", nullable = false, unique = true, length = 50)
    private String code;

    @Column(name = "Name", nullable = false, length = 150)
    private String name;

    @Column(name = "Description", length = 255)
    private String description;
}



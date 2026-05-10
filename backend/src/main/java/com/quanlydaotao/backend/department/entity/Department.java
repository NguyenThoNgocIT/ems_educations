package com.quanlydaotao.backend.department.entity;

import com.quanlydaotao.backend.infrastructure.persistence.base.BaseEntity;
import jakarta.persistence.*;
import lombok.*;

import java.util.UUID;

@Entity
@Table(name = "Departments", uniqueConstraints = {
    @UniqueConstraint(name = "UK_Department_Code", columnNames = "Code")
})
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Department extends BaseEntity {
    
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    @Column(name = "DepartmentId", columnDefinition = "uniqueidentifier", updatable = false, nullable = false)
    private UUID departmentId;  // ← SỬA: String → UUID
    
    @Column(name = "Code", nullable = false, unique = true, length = 50)
    private String code;
    
    @Column(name = "Name", nullable = false, length = 150)
    private String name;
    
    @Column(name = "Description", length = 255)
    private String description;
    
    @Builder.Default
    @Column(name = "IsActive", nullable = false)
    private Boolean isActive = true;
}
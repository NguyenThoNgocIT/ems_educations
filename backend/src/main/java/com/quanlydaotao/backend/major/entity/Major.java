package com.quanlydaotao.backend.major.entity;

import com.quanlydaotao.backend.infrastructure.persistence.base.BaseEntity;
import jakarta.persistence.*;
import lombok.*;

import java.util.UUID;

@Entity
@Table(name = "Majors", uniqueConstraints = {
    @UniqueConstraint(name = "UK_Major_Code", columnNames = "Code")
})
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Major extends BaseEntity {
    
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    @Column(name = "MajorId", columnDefinition = "uniqueidentifier", updatable = false, nullable = false)
    private UUID majorId;  // ← SỬA: String → UUID
    
    @Column(name = "DepartmentId", nullable = false, length = 50)
    private String departmentId;
    
    @Column(name = "Code", nullable = false, unique = true, length = 20)
    private String code;
    
    @Column(name = "Name", nullable = false, length = 255)
    private String name;
    
    @Column(name = "Description", columnDefinition = "NVARCHAR(MAX)")
    private String description;
    
    @Builder.Default
    @Column(name = "IsActive", nullable = false)
    private Boolean isActive = true;
}
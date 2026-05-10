package com.quanlydaotao.backend.major.entity;

import com.quanlydaotao.backend.infrastructure.persistence.base.BaseEntity;
import jakarta.persistence.*;
import lombok.*;

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
    @Column(name = "MajorId", length = 36)
    private String majorId;
    
    @Column(name = "DepartmentId", nullable = false, length = 50)
    private String departmentId;  // ← Đổi thành String
    
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
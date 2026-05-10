package com.quanlydaotao.backend.classmanagement.entity;

import com.quanlydaotao.backend.infrastructure.persistence.base.BaseEntity;
import jakarta.persistence.*;
import lombok.*;

import java.util.UUID;

@Entity
@Table(name = "Classes", uniqueConstraints = {
    @UniqueConstraint(name = "UK_Class_Code", columnNames = "ClassCode")
})
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Class extends BaseEntity {
    
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    @Column(name = "ClassId", columnDefinition = "uniqueidentifier", updatable = false, nullable = false)
    private UUID classId;
    
    @Column(name = "ClassCode", nullable = false, unique = true, length = 50)
    private String classCode;
    
    @Column(name = "ClassName", nullable = false, length = 100)
    private String className;
    
    @Column(name = "DepartmentId", length = 36)
    private String departmentId;
    
    @Column(name = "AdvisorId", length = 36)
    private String advisorId;
    
    @Column(name = "AcademicCohortId", length = 36)
    private String academicCohortId;
    
    @Column(name = "MaxSize")
    private Integer maxSize;
    
    @Column(name = "Status")
    private Integer status;
    
    @Column(name = "Note", length = 255)
    private String note;
    
    @Builder.Default
    @Column(name = "IsActive", nullable = false)
    private Boolean isActive = true;
}
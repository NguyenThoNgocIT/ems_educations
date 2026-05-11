package com.quanlydaotao.backend.schoolyear.entity;

import com.quanlydaotao.backend.infrastructure.persistence.base.BaseEntity;
import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDate;

@Entity
@Table(name = "SchoolYears", uniqueConstraints = {
    @UniqueConstraint(name = "UK_SchoolYear_Code", columnNames = "Code")
})
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class SchoolYear extends BaseEntity {
    
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    @Column(name = "SchoolYearId", length = 36)
    private String schoolYearId;
    
    @Column(name = "Code", nullable = false, length = 50, unique = true)
    private String code;
    
    @Column(name = "Name", length = 100)
    private String name;
    
    @Column(name = "StartDate", nullable = false)
    private LocalDate startDate;
    
    @Column(name = "EndDate", nullable = false)
    private LocalDate endDate;
    
    @Column(name = "Description", length = 255)
    private String description;
    
    @Builder.Default
    @Column(name = "Is_active", nullable = false)
    private Boolean isActive = true;
}
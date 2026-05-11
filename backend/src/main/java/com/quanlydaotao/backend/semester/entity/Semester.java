package com.quanlydaotao.backend.semester.entity;

import com.quanlydaotao.backend.infrastructure.persistence.base.BaseEntity;
import com.quanlydaotao.backend.schoolyear.entity.SchoolYear;
import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDate;

@Entity
@Table(name = "Semesters", uniqueConstraints = {
    @UniqueConstraint(name = "UK_Semester_Code", columnNames = "code"),
    @UniqueConstraint(name = "UK_Semester_Year_Code", columnNames = {"SchoolYearId", "code"})
})
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Semester extends BaseEntity {
    
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    @Column(name = "SemesterId", length = 36)
    private String semesterId;
    
    @Column(name = "code", nullable = false, length = 30)
    private String code;
    
    @Column(name = "name", nullable = false, length = 150)
    private String name;
    
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "SchoolYearId", nullable = false)
    private SchoolYear schoolYear;
    
    @Column(name = "start_date", nullable = false)
    private LocalDate startDate;
    
    @Column(name = "end_date", nullable = false)
    private LocalDate endDate;
    
    @Column(name = "status", nullable = false)
    private Integer status;
    
    @Column(name = "description", columnDefinition = "TEXT")
    private String description;
    
    @Builder.Default
    @Column(name = "Is_active", nullable = false)
    private Boolean isActive = true;
}
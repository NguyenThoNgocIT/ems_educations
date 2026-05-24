package com.quanlydaotao.backend.administrativeclass.entity;

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
@Table(name = "Classes")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class AdministrativeClass extends SoftDeleteEntity {
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    @Column(name = "ClassId", updatable = false, nullable = false)
    private UUID classId;

    @Column(name = "ClassCode", nullable = false, length = 50)
    private String classCode;

    @Column(name = "ClassName", nullable = false, length = 100)
    private String className;

    @Column(name = "DepartmentId")
    private UUID departmentId;

    @Column(name = "MajorId")
    private UUID majorId;

    @Column(name = "SpecializationId")
    private UUID specializationId;

    @Column(name = "AdvisorId")
    private UUID advisorId;

    @Column(name = "AcademicCohortId")
    private UUID academicCohortId;

    @Column(name = "MaxSize")
    private Integer maxSize;

    @Column(name = "Status")
    private Integer status;

    @Column(name = "ClassPhase", length = 30)
    private String classPhase;

    @Column(name = "Note", length = 255)
    private String note;
}

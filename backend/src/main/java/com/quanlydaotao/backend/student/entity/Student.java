package com.quanlydaotao.backend.student.entity;
import com.quanlydaotao.backend.infrastructure.persistence.base.SoftDeleteEntity;
import com.quanlydaotao.backend.person.entity.Person;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import java.util.UUID;
@Entity
@Table(name = "Students")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class Student extends SoftDeleteEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    @Column(name = "StudentId", updatable = false, nullable = false)
    private UUID studentId;
    @OneToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "PersonId", nullable = false, unique = true)
    private Person person;
    @Column(name = "StudentCode", nullable = false, length = 50, unique = true)
    private String studentCode;
    @Column(name = "Note", length = 255)
    private String note;
    @Column(name = "DepartmentId")
    private UUID departmentId;
    @Column(name = "TrainingProgramId")
    private UUID trainingProgramId;
    @Column(name = "MajorId")
    private UUID majorId;
    @Column(name = "SpecializationId")
    private UUID specializationId;
    @Column(name = "AcademicCohortId")
    private UUID academicCohortId;
    @Column(name = "ClassId")
    private UUID classId;

    @Column(name = "AdmissionDate")
    private java.time.LocalDate admissionDate;
}



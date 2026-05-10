package com.quanlydaotao.backend.lecturer.entity;
import com.quanlydaotao.backend.infrastructure.persistence.base.SoftDeleteEntity;
import com.quanlydaotao.backend.user.entity.Employee;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import java.util.UUID;
@Entity
@Table(name = "Instructors")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class LecturerProfile extends SoftDeleteEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    @Column(name = "InstructorId", columnDefinition = "uniqueidentifier", updatable = false, nullable = false)
    private UUID instructorId;
    @OneToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "EmployeeId", nullable = false, unique = true)
    private Employee employee;
    @Column(name = "InstructorCode", nullable = false, length = 50, unique = true)
    private String instructorCode;
    @Column(name = "DepartmentId")
    private UUID departmentId;
    @Column(name = "DegreeId")
    private UUID degreeId;
}



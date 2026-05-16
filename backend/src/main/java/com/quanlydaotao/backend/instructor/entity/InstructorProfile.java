package com.quanlydaotao.backend.instructor.entity;

import com.quanlydaotao.backend.employee.entity.Employee;
import com.quanlydaotao.backend.infrastructure.persistence.base.SoftDeleteEntity;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.MapsId;
import jakarta.persistence.OneToOne;
import jakarta.persistence.Table;
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
public class InstructorProfile extends SoftDeleteEntity {

    @Id
    @Column(name = "EmployeeId", columnDefinition = "uniqueidentifier", updatable = false, nullable = false)
    private UUID employeeId;

    @OneToOne(fetch = FetchType.LAZY)
    @MapsId
    @JoinColumn(name = "EmployeeId")
    private Employee employee;

    @Column(name = "InstructorCode", nullable = false, length = 50, unique = true)
    private String instructorCode;

    @Column(name = "DepartmentId")
    private UUID departmentId;

    @Column(name = "DegreeId")
    private UUID degreeId;

    public UUID getInstructorId() {
        return employeeId;
    }
}

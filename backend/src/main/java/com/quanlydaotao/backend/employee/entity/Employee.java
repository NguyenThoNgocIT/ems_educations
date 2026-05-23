package com.quanlydaotao.backend.employee.entity;
import com.quanlydaotao.backend.person.entity.Person;
import com.quanlydaotao.backend.infrastructure.persistence.base.SoftDeleteEntity;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import java.time.LocalDate;
import java.util.UUID;
@Entity
@Table(name = "Employees")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class Employee extends SoftDeleteEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    @Column(name = "EmployeeId", updatable = false, nullable = false)
    private UUID employeeId;
    @OneToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "PersonId", nullable = false, unique = true)
    private Person person;
    @Column(name = "EmployeeCode", nullable = false, length = 50, unique = true)
    private String employeeCode;
    @Column(name = "StartWorkDate")
    private LocalDate startWorkDate;
    @Column(name = "EndWorkDate")
    private LocalDate endWorkDate;
    @Column(name = "Status", length = 50)
    private String status;

    @Column(name = "EmployeeType", length = 20)
    private String employeeType;
    @Column(name = "ContractType", length = 50)
    private String contractType;
    @Column(name = "Note", length = 255)
    private String note;
}




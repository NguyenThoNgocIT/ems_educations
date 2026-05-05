package com.quanlydaotao.backend.user.entity;
import com.quanlydaotao.backend.infrastructure.persistence.base.SoftDeleteEntity;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import java.time.LocalDate;
@Entity
@Table(name = "Employees")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class Employee extends SoftDeleteEntity {
<<<<<<< HEAD
=======

    @jakarta.persistence.Id
    @jakarta.persistence.GeneratedValue(generator = "UUID")
    @org.hibernate.annotations.GenericGenerator(name = "UUID", strategy = "org.hibernate.id.UUIDGenerator")
    @jakarta.persistence.Column(name = "EmployeeId", columnDefinition = "uniqueidentifier", updatable = false, nullable = false)
    private java.util.UUID employeeId;
>>>>>>> origin/develop
    @OneToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "PersonId", nullable = false, unique = true)
    private Person person;
    @Column(name = "EmployeeCode", nullable = false, length = 50, unique = true)
    private String employeeCode;
    @Column(name = "StartWorkDate")
    private LocalDate startWorkDate;
    @Column(name = "Status", length = 50)
    private String status;
}

<<<<<<< HEAD
=======

>>>>>>> origin/develop

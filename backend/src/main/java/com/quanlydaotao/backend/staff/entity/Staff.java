package com.quanlydaotao.backend.staff.entity;
import com.quanlydaotao.backend.infrastructure.persistence.base.SoftDeleteEntity;
import com.quanlydaotao.backend.user.entity.Employee;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import java.util.UUID;
@Entity
@Table(name = "Staffs")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class Staff extends SoftDeleteEntity {
    @Id
    @Column(name = "EmployeeId", columnDefinition = "uniqueidentifier", updatable = false, nullable = false)
    private UUID employeeId;
    @OneToOne(fetch = FetchType.LAZY)
    @MapsId
    @JoinColumn(name = "EmployeeId")
    private Employee employee;
    @Column(name = "StaffCode", nullable = false, length = 50, unique = true)
    private String staffCode;
    @Column(name = "DivisionId")
    private UUID divisionId;
    @Column(name = "PositionId")
    private UUID positionId;
}

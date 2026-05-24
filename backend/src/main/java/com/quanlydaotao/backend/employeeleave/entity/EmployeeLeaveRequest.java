package com.quanlydaotao.backend.employeeleave.entity;

import com.quanlydaotao.backend.infrastructure.persistence.base.SoftDeleteEntity;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDate;
import java.util.UUID;

@Entity
@Table(name = "EmployeeLeaveRequests")
@Getter
@Setter
public class EmployeeLeaveRequest extends SoftDeleteEntity {
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    @Column(name = "LeaveRequestId", updatable = false, nullable = false)
    private UUID leaveRequestId;

    @Column(name = "EmployeeId", nullable = false)
    private UUID employeeId;

    @Column(name = "FromDate", nullable = false)
    private LocalDate fromDate;

    @Column(name = "ToDate", nullable = false)
    private LocalDate toDate;

    @Column(name = "Status", nullable = false)
    private Integer status;
}

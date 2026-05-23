package com.quanlydaotao.backend.contract.entity;

import com.quanlydaotao.backend.employee.entity.Employee;
import com.quanlydaotao.backend.infrastructure.persistence.base.SoftDeleteEntity;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.UUID;

@Entity
@Table(name = "Contracts")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class Contract extends SoftDeleteEntity {
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    @Column(name = "ContractId", updatable = false, nullable = false)
    private UUID contractId;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "EmployeeId", nullable = false)
    private Employee employee;

    @Column(name = "ContractNo", length = 50)
    private String contractNo;

    @Column(name = "ContractType", nullable = false, length = 100)
    private String contractType;

    @Column(name = "SignedDate")
    private LocalDate signedDate;

    @Column(name = "EffectiveDate")
    private LocalDate effectiveDate;

    @Column(name = "ExpiredDate")
    private LocalDate expiredDate;

    @Column(name = "BaseSalary", precision = 18, scale = 2)
    private BigDecimal baseSalary;

    @Column(name = "Status", nullable = false)
    private Integer status;

    @Column(name = "Note", length = 255)
    private String note;

    @Column(name = "Allowance", precision = 18, scale = 2)
    private BigDecimal allowance;

    @Column(name = "SignedBy", length = 150)
    private String signedBy;

    @Column(name = "AnnualLeave")
    private Integer annualLeave;
}

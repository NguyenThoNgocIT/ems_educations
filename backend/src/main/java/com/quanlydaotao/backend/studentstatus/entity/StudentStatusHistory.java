package com.quanlydaotao.backend.studentstatus.entity;

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

import java.time.LocalDate;
import java.util.UUID;

@Entity
@Table(name = "StudentStatusHistories")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class StudentStatusHistory extends SoftDeleteEntity {
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    @Column(name = "StudentStatusHistoryId", updatable = false, nullable = false)
    private UUID studentStatusHistoryId;

    @Column(name = "StudentId", nullable = false)
    private UUID studentId;

    @Column(name = "StudentStatusId", nullable = false)
    private UUID studentStatusId;

    @Column(name = "StartDate", nullable = false)
    private LocalDate startDate;

    @Column(name = "EndDate")
    private LocalDate endDate;

    @Column(name = "IsCurrent", nullable = false)
    private Boolean isCurrent = false;

    @Column(name = "Reason", length = 255)
    private String reason;

    @Column(name = "DecisionNo", length = 50)
    private String decisionNo;

    @Column(name = "DecisionDate")
    private LocalDate decisionDate;

    @Column(name = "DecidedBy", length = 150)
    private String decidedBy;

    @Column(name = "WarningLevel")
    private Integer warningLevel;

    @Column(name = "AllowRegister", nullable = false)
    private Boolean allowRegister = true;

    @Column(name = "AllowExam", nullable = false)
    private Boolean allowExam = true;
}

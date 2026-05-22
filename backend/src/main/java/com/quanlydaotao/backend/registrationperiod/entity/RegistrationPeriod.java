package com.quanlydaotao.backend.registrationperiod.entity;

import com.quanlydaotao.backend.infrastructure.persistence.base.SoftDeleteEntity;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDateTime;
import java.util.UUID;

@Entity
@Table(name = "RegistrationPeriods")
@Getter
@Setter
public class RegistrationPeriod extends SoftDeleteEntity {
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    @Column(name = "RegistrationPeriodId", columnDefinition = "uniqueidentifier", updatable = false, nullable = false)
    private UUID registrationPeriodId;

    @Column(name = "Code", nullable = false, length = 30)
    private String code;

    @Column(name = "Name", nullable = false, length = 150)
    private String name;

    @Column(name = "SemesterId", nullable = false, columnDefinition = "uniqueidentifier")
    private UUID semesterId;

    @Column(name = "StartDate", nullable = false)
    private LocalDateTime startDate;

    @Column(name = "EndDate", nullable = false)
    private LocalDateTime endDate;

    @Column(name = "Status")
    private Integer status;

    @Column(name = "MinCredits")
    private Integer minCredits;

    @Column(name = "MaxCredits")
    private Integer maxCredits;

    @Column(name = "AllowRetake")
    private Boolean allowRetake;
}

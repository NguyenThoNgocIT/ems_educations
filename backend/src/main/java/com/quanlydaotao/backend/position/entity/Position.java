package com.quanlydaotao.backend.position.entity;

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

import java.math.BigDecimal;
import java.util.UUID;

@Entity
@Table(name = "Positions")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class Position extends SoftDeleteEntity {
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    @Column(name = "PositionId", updatable = false, nullable = false)
    private UUID positionId;

    @Column(name = "Code", nullable = false, length = 50)
    private String code;

    @Column(name = "Name", nullable = false, length = 150)
    private String name;

    @Column(name = "Allowance", precision = 18, scale = 2)
    private BigDecimal allowance;

    @Column(name = "Description", length = 255)
    private String description;

    @Column(name = "Level", length = 100)
    private String level;

    @Column(name = "DivisionId")
    private UUID divisionId;
}

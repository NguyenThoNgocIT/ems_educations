package com.quanlydaotao.backend.facility.entity;

import com.quanlydaotao.backend.infrastructure.persistence.base.SoftDeleteEntity;
import jakarta.persistence.*;
import lombok.*;

import java.util.UUID;

@Entity
@Table(name = "Floors")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Floor extends SoftDeleteEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    @Column(name = "FloorId", updatable = false, nullable = false)
    private UUID floorId;

    @Column(name = "Code", nullable = false, length = 100)
    private String code;

    @Column(name = "Name", length = 255)
    private String name;

    @Column(name = "FloorNumber", nullable = false)
    private Integer floorNumber;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "BuildingId", nullable = false)
    private Building building;

    @Column(name = "Description", length = 255)
    private String description;
}

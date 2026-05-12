package com.quanlydaotao.backend.facility.entity;

import com.quanlydaotao.backend.infrastructure.persistence.base.SoftDeleteEntity;
import jakarta.persistence.*;
import lombok.*;

import java.util.UUID;

@Entity
@Table(name = "Buildings")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Building extends SoftDeleteEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    @Column(name = "BuildingId", columnDefinition = "uniqueidentifier", updatable = false, nullable = false)
    private UUID buildingId;

    @Column(name = "Code", nullable = false, unique = true, length = 100)
    private String code;

    @Column(name = "Name", nullable = false, length = 255)
    private String name;

    @Column(name = "Address", length = 200)
    private String address;

    @Column(name = "TotalFloors")
    private Integer totalFloors;

    @Column(name = "BuildingType", length = 10)
    private String buildingType;

    @Column(name = "Description", length = 255)
    private String description;

    @Column(name = "Note", length = 255)
    private String note;
}

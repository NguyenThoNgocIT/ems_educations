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
    @Column(name = "BuildingId", updatable = false, nullable = false)
    private UUID buildingId;

    @Column(name = "Code", nullable = false, unique = true, length = 100)
    private String code;

    @Column(name = "Name", nullable = false, length = 200)  // Tăng từ 255 lên 200
    private String name;

    @Column(name = "Address", length = 500)  // Tăng từ 200 lên 500
    private String address;

    @Column(name = "TotalFloors")
    private Integer totalFloors;

    @Column(name = "BuildingType", length = 100)  // Tăng từ 10 lên 100
    private String buildingType;

    @Column(name = "Description", length = 500)  // Tăng từ 255 lên 500
    private String description;

    @Column(name = "Note", length = 500)  // Tăng từ 255 lên 500
    private String note;
}
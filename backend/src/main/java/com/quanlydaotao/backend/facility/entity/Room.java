package com.quanlydaotao.backend.facility.entity;

import com.quanlydaotao.backend.infrastructure.persistence.base.SoftDeleteEntity;
import jakarta.persistence.*;
import lombok.*;

import java.util.UUID;

@Entity
@Table(name = "Rooms")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Room extends SoftDeleteEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    @Column(name = "RoomId", updatable = false, nullable = false)
    private UUID roomId;

    @Column(name = "Code", nullable = false, unique = true, length = 100)
    private String code;

    @Column(name = "Name", length = 200)  // Tăng từ 255 lên 200
    private String name;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "BuildingId", nullable = false)
    private Building building;

    @Column(name = "FloorNumber")
    private Integer floorNumber;

    @Column(name = "Capacity")
    private Integer capacity;

    @Column(name = "Type", length = 100)  // Tăng từ 50 lên 100
    private String type;

    @Column(name = "Status", length = 50)  // Giữ nguyên 50 là đủ
    private String status;

    @Column(name = "HasProjector")
    private Boolean hasProjector;

    @Column(name = "HasAirConditioner")
    private Boolean hasAirConditioner;

    @Column(name = "HasComputer")
    private Boolean hasComputer;

    @Column(name = "Description", length = 500)  // Tăng từ 255 lên 500
    private String description;
}
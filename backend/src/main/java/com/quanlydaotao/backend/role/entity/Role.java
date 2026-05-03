package com.quanlydaotao.backend.role.entity;

import com.quanlydaotao.backend.infrastructure.persistence.base.SoftDeleteEntity;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@Table(name = "Roles")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class Role extends SoftDeleteEntity {

    @Column(name = "Code", nullable = false, unique = true, length = 50)
    private String code;

    @Column(name = "Name", nullable = false, length = 100)
    private String name;

    @Column(name = "Description", length = 255)
    private String description;

    @Column(name = "Level")
    private Integer level;

    @Column(name = "IsSystem", nullable = false)
    private Boolean isSystem = false;

    @Column(name = "DisplayOrder")
    private Integer displayOrder;

    @Column(name = "Color", length = 20)
    private String color;
}


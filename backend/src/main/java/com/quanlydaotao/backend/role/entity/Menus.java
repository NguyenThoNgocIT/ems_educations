package com.quanlydaotao.backend.role.entity;

import com.quanlydaotao.backend.infrastructure.persistence.base.SoftDeleteEntity;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.util.UUID;

@Entity
@Table(name = "Menus")
@Getter
@Setter
@NoArgsConstructor
public class Menus extends SoftDeleteEntity {

    @jakarta.persistence.Id
    @jakarta.persistence.GeneratedValue(generator = "UUID")
    @org.hibernate.annotations.GenericGenerator(name = "UUID", strategy = "org.hibernate.id.UUIDGenerator")
    @jakarta.persistence.Column(name = "MenuId", columnDefinition = "uniqueidentifier", updatable = false, nullable = false)
    private java.util.UUID menuId;

    @Column(name = "ParentId", columnDefinition = "uniqueidentifier")
    private UUID parentId;

    @Column(name = "MenuTitle", length = 100)
    private String menuTitle;

    @Column(name = "MenuUrl", length = 255)
    private String menuUrl;

    @Column(name = "MenuIcon", length = 50)
    private String menuIcon;

    @Column(name = "OrderIndex")
    private Integer orderIndex;

    @Column(name = "MenuType")
    private Integer menuType;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "PermissionId")
    private Permission permission;
}


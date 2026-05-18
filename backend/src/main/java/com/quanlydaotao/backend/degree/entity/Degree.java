package com.quanlydaotao.backend.degree.entity;

import com.quanlydaotao.backend.infrastructure.persistence.base.SoftDeleteEntity;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.util.UUID;

@Entity
@Table(name = "Degrees")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class Degree extends SoftDeleteEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    @Column(name = "DegreeId", columnDefinition = "uniqueidentifier", updatable = false, nullable = false)
    private UUID degreeId;

    @Column(name = "Name", nullable = false, length = 150)
    private String name;

    @Column(name = "Major", length = 150)
    private String major;

}


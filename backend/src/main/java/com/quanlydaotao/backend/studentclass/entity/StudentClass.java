package com.quanlydaotao.backend.studentclass.entity;

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

import java.util.UUID;

@Entity
@Table(name = "StudentClasses")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class StudentClass extends SoftDeleteEntity {
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    @Column(name = "StudentClassId", columnDefinition = "uniqueidentifier", updatable = false, nullable = false)
    private UUID studentClassId;

    @Column(name = "StudentId", nullable = false, columnDefinition = "uniqueidentifier")
    private UUID studentId;

    @Column(name = "ClassId", nullable = false, columnDefinition = "uniqueidentifier")
    private UUID classId;

    @Column(name = "SemesterId", nullable = false, columnDefinition = "uniqueidentifier")
    private UUID semesterId;

    @Column(name = "RoleInClass", length = 50)
    private String roleInClass;

    @Column(name = "Status", length = 50)
    private String status;

    @Column(name = "Note", length = 255)
    private String note;
}

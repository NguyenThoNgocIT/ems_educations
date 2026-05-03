package com.quanlydaotao.backend.course.entity;

import com.quanlydaotao.backend.infrastructure.persistence.base.SoftDeleteEntity;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Table;
import jakarta.persistence.UniqueConstraint;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.util.UUID;

@Entity
@Table(name = "CourseClasses", uniqueConstraints = {
    @UniqueConstraint(columnNames = {"SemesterId", "CourseId", "ClassCode"})
})
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class CourseClass extends SoftDeleteEntity {

    @Column(name = "ClassCode", nullable = false, length = 50)
    private String classCode;

    @Column(name = "MaxStudent")
    private Integer maxStudent;

    @Column(name = "CurrentStudent")
    private Integer currentStudent;

    @Column(name = "RoomId")
    private UUID roomId;

    @Column(name = "Status", length = 20)
    private String status;

    @Column(name = "SemesterId", nullable = false)
    private UUID semesterId;

    @Column(name = "CourseId", nullable = false)
    private UUID courseId;
}

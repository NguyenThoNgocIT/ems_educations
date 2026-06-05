package com.quanlydaotao.backend.grade.entity;

import jakarta.persistence.Column;
import jakarta.persistence.Embeddable;
import lombok.AllArgsConstructor;
import lombok.EqualsAndHashCode;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.io.Serializable;
import java.util.UUID;

@Embeddable
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@EqualsAndHashCode
public class StudentComponentGradeId implements Serializable {
    @Column(name = "CourseRegistrationId", nullable = false)
    private UUID courseRegistrationId;

    @Column(name = "GradeComponentId", nullable = false)
    private UUID gradeComponentId;
}

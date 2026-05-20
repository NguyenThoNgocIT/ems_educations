package com.quanlydaotao.backend.trainingprogramcourse.entity;

import lombok.AllArgsConstructor;
import lombok.EqualsAndHashCode;
import lombok.NoArgsConstructor;

import java.io.Serializable;
import java.util.UUID;

@NoArgsConstructor
@AllArgsConstructor
@EqualsAndHashCode
public class TrainingProgramCourseId implements Serializable {
    private UUID trainingProgramId;
    private UUID courseId;
}

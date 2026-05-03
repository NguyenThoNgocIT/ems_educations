package com.quanlydaotao.backend.course.entity;

import lombok.AllArgsConstructor;
import lombok.EqualsAndHashCode;
import lombok.NoArgsConstructor;

import java.io.Serializable;
import java.util.UUID;

@EqualsAndHashCode
@NoArgsConstructor
@AllArgsConstructor
public class CoursePrerequisiteId implements Serializable {
    private UUID courseId;
    private UUID prerequisiteCourseId;
}

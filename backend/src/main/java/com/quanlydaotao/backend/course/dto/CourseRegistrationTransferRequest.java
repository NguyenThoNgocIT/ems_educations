package com.quanlydaotao.backend.course.dto;

import lombok.Data;

import java.util.UUID;

@Data
public class CourseRegistrationTransferRequest {
    private UUID targetCourseClassId;
}

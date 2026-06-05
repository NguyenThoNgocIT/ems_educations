package com.quanlydaotao.backend.course.service;

import com.quanlydaotao.backend.course.dto.CourseRegistrationResponse;
import com.quanlydaotao.backend.course.dto.RetakeImprovementOptionResponse;
import com.quanlydaotao.backend.course.dto.RetakeImprovementRegistrationRequest;

import java.util.List;
import java.util.UUID;

public interface RegistrationService {
    CourseRegistrationResponse registerCourse(UUID studentId, UUID courseClassId);

    List<RetakeImprovementOptionResponse> getCurrentStudentRetakeImprovementOptions(String username, UUID semesterId);

    CourseRegistrationResponse registerCurrentStudentRetakeImprovement(String username, RetakeImprovementRegistrationRequest request);
}

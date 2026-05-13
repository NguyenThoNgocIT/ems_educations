package com.quanlydaotao.backend.course.service;

import com.quanlydaotao.backend.course.entity.CourseRegistration;
import java.util.UUID;

public interface RegistrationService {
    CourseRegistration registerCourse(UUID studentId, UUID courseClassId);
}

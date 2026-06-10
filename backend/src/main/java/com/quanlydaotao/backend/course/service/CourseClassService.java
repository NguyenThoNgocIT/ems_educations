package com.quanlydaotao.backend.course.service;

import com.quanlydaotao.backend.course.dto.CourseClassDto;
import com.quanlydaotao.backend.course.dto.CourseClassStudentResponse;
import com.quanlydaotao.backend.course.dto.AdminAddCourseClassStudentRequest;

import java.util.List;
import java.util.UUID;

public interface CourseClassService {
    CourseClassDto createCourseClass(CourseClassDto courseClassDto);
    CourseClassDto getCourseClassById(UUID id);
    List<CourseClassDto> getAllCourseClasses();
    List<CourseClassDto> getCourseClassesByCourse(UUID courseId);
    List<CourseClassDto> getCourseClassesBySemester(UUID semesterId);
    List<CourseClassStudentResponse> getStudentsByCourseClass(UUID courseClassId);
    CourseClassStudentResponse addStudentToCourseClass(UUID courseClassId, AdminAddCourseClassStudentRequest request);
    CourseClassStudentResponse transferStudentCourseClass(UUID courseRegistrationId, UUID targetCourseClassId);
    void removeStudentFromCourseClass(UUID courseRegistrationId);
    CourseClassDto updateCourseClass(UUID id, CourseClassDto courseClassDto);
    void deleteCourseClass(UUID id);
}

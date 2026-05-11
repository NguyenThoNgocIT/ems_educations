package com.quanlydaotao.backend.course.service;

import com.quanlydaotao.backend.course.dto.CourseClassDto;

import java.util.List;
import java.util.UUID;

public interface CourseClassService {
    CourseClassDto createCourseClass(CourseClassDto courseClassDto);
    CourseClassDto getCourseClassById(UUID id);
    List<CourseClassDto> getAllCourseClasses();
    List<CourseClassDto> getCourseClassesByCourse(UUID courseId);
    List<CourseClassDto> getCourseClassesBySemester(UUID semesterId);
    CourseClassDto updateCourseClass(UUID id, CourseClassDto courseClassDto);
    void deleteCourseClass(UUID id);
}

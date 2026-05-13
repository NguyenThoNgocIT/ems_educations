package com.quanlydaotao.backend.course.service;

import com.quanlydaotao.backend.course.dto.CourseDto;

import java.util.List;
import java.util.UUID;

public interface CourseService {
    CourseDto createCourse(CourseDto courseDto);
    CourseDto getCourseById(UUID id);
    CourseDto getCourseByCode(String code);
    List<CourseDto> getAllCourses();
    List<CourseDto> getCoursesByDepartment(UUID departmentId);
    CourseDto updateCourse(UUID id, CourseDto courseDto);
    void deleteCourse(UUID id);
}

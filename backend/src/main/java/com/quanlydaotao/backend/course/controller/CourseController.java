package com.quanlydaotao.backend.course.controller;

import com.quanlydaotao.backend.course.dto.CourseClassDto;
import com.quanlydaotao.backend.course.dto.CourseDto;
import com.quanlydaotao.backend.course.service.CourseClassService;
import com.quanlydaotao.backend.course.service.CourseService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/v1/courses")
@RequiredArgsConstructor
public class CourseController {

    private final CourseService courseService;
    private final CourseClassService courseClassService;

    // ==================== Course Endpoints ====================

    @PostMapping
    public ResponseEntity<CourseDto> createCourse(@RequestBody CourseDto courseDto) {
        return new ResponseEntity<>(courseService.createCourse(courseDto), HttpStatus.CREATED);
    }

    @GetMapping("/{id}")
    public ResponseEntity<CourseDto> getCourseById(@PathVariable UUID id) {
        return ResponseEntity.ok(courseService.getCourseById(id));
    }

    @GetMapping("/code/{code}")
    public ResponseEntity<CourseDto> getCourseByCode(@PathVariable String code) {
        return ResponseEntity.ok(courseService.getCourseByCod(code));
    }

    @GetMapping
    public ResponseEntity<List<CourseDto>> getAllCourses() {
        return ResponseEntity.ok(courseService.getAllCourses());
    }

    @GetMapping("/department/{departmentId}")
    public ResponseEntity<List<CourseDto>> getCoursesByDepartment(@PathVariable UUID departmentId) {
        return ResponseEntity.ok(courseService.getCoursesByDepartment(departmentId));
    }

    @PutMapping("/{id}")
    public ResponseEntity<CourseDto> updateCourse(@PathVariable UUID id, @RequestBody CourseDto courseDto) {
        return ResponseEntity.ok(courseService.updateCourse(id, courseDto));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteCourse(@PathVariable UUID id) {
        courseService.deleteCourse(id);
        return ResponseEntity.noContent().build();
    }

    // ==================== CourseClass Endpoints ====================

    @PostMapping("/classes")
    public ResponseEntity<CourseClassDto> createCourseClass(@RequestBody CourseClassDto courseClassDto) {
        return new ResponseEntity<>(courseClassService.createCourseClass(courseClassDto), HttpStatus.CREATED);
    }

    @GetMapping("/classes/{id}")
    public ResponseEntity<CourseClassDto> getCourseClassById(@PathVariable UUID id) {
        return ResponseEntity.ok(courseClassService.getCourseClassById(id));
    }

    @GetMapping("/classes")
    public ResponseEntity<List<CourseClassDto>> getAllCourseClasses() {
        return ResponseEntity.ok(courseClassService.getAllCourseClasses());
    }

    @GetMapping("/{courseId}/classes")
    public ResponseEntity<List<CourseClassDto>> getCourseClassesByCourse(@PathVariable UUID courseId) {
        return ResponseEntity.ok(courseClassService.getCourseClassesByCourse(courseId));
    }

    @GetMapping("/classes/semester/{semesterId}")
    public ResponseEntity<List<CourseClassDto>> getCourseClassesBySemester(@PathVariable UUID semesterId) {
        return ResponseEntity.ok(courseClassService.getCourseClassesBySemester(semesterId));
    }

    @PutMapping("/classes/{id}")
    public ResponseEntity<CourseClassDto> updateCourseClass(@PathVariable UUID id, @RequestBody CourseClassDto courseClassDto) {
        return ResponseEntity.ok(courseClassService.updateCourseClass(id, courseClassDto));
    }

    @DeleteMapping("/classes/{id}")
    public ResponseEntity<Void> deleteCourseClass(@PathVariable UUID id) {
        courseClassService.deleteCourseClass(id);
        return ResponseEntity.noContent().build();
    }
}

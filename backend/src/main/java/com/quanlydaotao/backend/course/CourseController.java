package com.quanlydaotao.backend.course;

import java.util.List;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/v1/teacher/courses")
@RequiredArgsConstructor
@PreAuthorize("hasRole('TEACHER')")
public class CourseController {

  private final CourseService courseService;

  @GetMapping
  public ResponseEntity<List<Course>> getAllCourses() {
    return ResponseEntity.ok(courseService.getAllCourses());
  }

  @GetMapping("/{id}")
  public ResponseEntity<Course> getCourseById(@PathVariable Integer id) {
    return ResponseEntity.ok(courseService.getCourseById(id));
  }

  @PostMapping
  public ResponseEntity<Course> createCourse(
      @RequestBody CourseRequest request,
      Authentication authentication
  ) {
    Integer teacherId = (Integer) authentication.getPrincipal();
    return ResponseEntity.ok(courseService.createCourse(request, teacherId));
  }

  @PutMapping("/{id}")
  public ResponseEntity<Course> updateCourse(
      @PathVariable Integer id,
      @RequestBody CourseRequest request
  ) {
    return ResponseEntity.ok(courseService.updateCourse(id, request));
  }

  @DeleteMapping("/{id}")
  public ResponseEntity<String> deleteCourse(@PathVariable Integer id) {
    courseService.deleteCourse(id);
    return ResponseEntity.ok("Course deleted successfully");
  }

}

package com.quanlydaotao.backend.enrollment;

import java.util.List;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/v1/student/enrollments")
@RequiredArgsConstructor
@PreAuthorize("hasRole('STUDENT')")
public class EnrollmentController {

  private final EnrollmentService enrollmentService;

  @PostMapping
  public ResponseEntity<Enrollment> enrollCourse(
      @RequestBody EnrollmentRequest request,
      Authentication authentication
  ) {
    Integer studentId = (Integer) authentication.getPrincipal();
    return ResponseEntity.ok(enrollmentService.enrollStudent(studentId, request.getCourseId()));
  }

  @GetMapping
  public ResponseEntity<List<Enrollment>> getMyEnrollments(
      Authentication authentication
  ) {
    Integer studentId = (Integer) authentication.getPrincipal();
    return ResponseEntity.ok(enrollmentService.getEnrollmentsByStudent(studentId));
  }

}

package com.quanlydaotao.backend.enrollment;

import com.quanlydaotao.backend.course.Course;
import com.quanlydaotao.backend.course.CourseRepository;
import com.quanlydaotao.backend.user.User;
import com.quanlydaotao.backend.user.UserRepository;
import java.util.List;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class EnrollmentService {

  private final EnrollmentRepository enrollmentRepository;
  private final UserRepository userRepository;
  private final CourseRepository courseRepository;

  public Enrollment enrollStudent(Integer studentId, Integer courseId) {
    User student = userRepository.findById(studentId)
        .orElseThrow(() -> new RuntimeException("Student not found"));

    Course course = courseRepository.findById(courseId)
        .orElseThrow(() -> new RuntimeException("Course not found"));

    Enrollment enrollment = Enrollment.builder()
        .student(student)
        .course(course)
        .status(EnrollmentStatus.ENROLLED)
        .build();

    return enrollmentRepository.save(enrollment);
  }

  public List<Enrollment> getEnrollmentsByStudent(Integer studentId) {
    return enrollmentRepository.findByStudentId(studentId);
  }

  public List<Enrollment> getEnrollmentsByCourse(Integer courseId) {
    return enrollmentRepository.findByCourseId(courseId);
  }

}

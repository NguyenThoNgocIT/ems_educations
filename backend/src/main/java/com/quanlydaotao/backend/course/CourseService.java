package com.quanlydaotao.backend.course;

import com.quanlydaotao.backend.exception.NotFoundException;
import com.quanlydaotao.backend.user.User;
import com.quanlydaotao.backend.user.UserRepository;
import java.util.List;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class CourseService {

  private final CourseRepository courseRepository;
  private final UserRepository userRepository;

  public List<Course> getAllCourses() {
    return courseRepository.findAll();
  }

  public Course getCourseById(Integer id) {
    return courseRepository.findById(id)
        .orElseThrow(() -> new NotFoundException("Course not found"));
  }

  public List<Course> getCoursesByTeacher(Integer teacherId) {
    return courseRepository.findByTeacherId(teacherId);
  }

  public Course createCourse(CourseRequest request, Integer teacherId) {
    User teacher = userRepository.findById(teacherId)
        .orElseThrow(() -> new NotFoundException("Teacher not found"));

    Course course = Course.builder()
        .title(request.getTitle())
        .description(request.getDescription())
        .teacher(teacher)
        .build();

    return courseRepository.save(course);
  }

  public Course updateCourse(Integer id, CourseRequest request) {
    Course course = getCourseById(id);
    course.setTitle(request.getTitle());
    course.setDescription(request.getDescription());
    return courseRepository.save(course);
  }

  public void deleteCourse(Integer id) {
    courseRepository.deleteById(id);
  }

}

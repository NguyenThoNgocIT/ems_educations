package com.quanlydaotao.backend.classroom;

import com.quanlydaotao.backend.course.Course;
import com.quanlydaotao.backend.course.CourseRepository;
import com.quanlydaotao.backend.user.User;
import com.quanlydaotao.backend.user.UserRepository;
import java.util.List;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class ClassroomService {

  private final ClassroomRepository classroomRepository;
  private final CourseRepository courseRepository;
  private final UserRepository userRepository;

  public List<Classroom> getAllClassrooms() {
    return classroomRepository.findAll();
  }

  public Classroom getClassroomById(Integer id) {
    return classroomRepository.findById(id)
        .orElseThrow(() -> new RuntimeException("Classroom not found"));
  }

  public List<Classroom> getClassroomsByManager(Integer managerId) {
    return classroomRepository.findByManagerId(managerId);
  }

  public Classroom createClassroom(ClassroomRequest request, Integer managerId) {
    Course course = courseRepository.findById(request.getCourseId())
        .orElseThrow(() -> new RuntimeException("Course not found"));

    User manager = userRepository.findById(managerId)
        .orElseThrow(() -> new RuntimeException("Manager not found"));

    Classroom classroom = Classroom.builder()
        .name(request.getName())
        .course(course)
        .manager(manager)
        .build();

    return classroomRepository.save(classroom);
  }

}

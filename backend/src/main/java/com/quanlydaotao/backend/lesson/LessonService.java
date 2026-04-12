package com.quanlydaotao.backend.lesson;

import com.quanlydaotao.backend.course.Course;
import com.quanlydaotao.backend.course.CourseRepository;
import java.util.List;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class LessonService {

  private final LessonRepository lessonRepository;
  private final CourseRepository courseRepository;

  public Lesson createLesson(LessonRequest request) {
    Course course = courseRepository.findById(request.getCourseId())
        .orElseThrow(() -> new RuntimeException("Course not found"));

    Lesson lesson = Lesson.builder()
        .title(request.getTitle())
        .content(request.getContent())
        .course(course)
        .build();

    return lessonRepository.save(lesson);
  }

  public List<Lesson> getLessonsByCourse(Integer courseId) {
    return lessonRepository.findByCourseId(courseId);
  }

  public Lesson getLessonById(Integer id) {
    return lessonRepository.findById(id)
        .orElseThrow(() -> new RuntimeException("Lesson not found"));
  }

}

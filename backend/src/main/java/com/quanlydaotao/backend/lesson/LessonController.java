package com.quanlydaotao.backend.lesson;

import java.util.List;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/v1")
@RequiredArgsConstructor
public class LessonController {

  private final LessonService lessonService;

  @PostMapping("/teacher/lessons")
  @PreAuthorize("hasRole('TEACHER')")
  public ResponseEntity<Lesson> createLesson(
      @RequestBody LessonRequest request
  ) {
    return ResponseEntity.ok(lessonService.createLesson(request));
  }

  @GetMapping("/student/lessons/{courseId}")
  @PreAuthorize("hasRole('STUDENT')")
  public ResponseEntity<List<Lesson>> getLessonsByCourse(
      @PathVariable Integer courseId
  ) {
    return ResponseEntity.ok(lessonService.getLessonsByCourse(courseId));
  }

}

package com.quanlydaotao.backend.lesson;

import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface LessonRepository extends JpaRepository<Lesson, Integer> {
  List<Lesson> findByCourseId(Integer courseId);
}

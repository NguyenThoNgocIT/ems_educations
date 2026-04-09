package com.quanlydaotao.backend.course;

import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface CourseRepository extends JpaRepository<Course, Integer> {
  List<Course> findByTeacherId(Integer teacherId);
}

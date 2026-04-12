package com.quanlydaotao.backend.classroom;

import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface ClassroomRepository extends JpaRepository<Classroom, Integer> {
  List<Classroom> findByManagerId(Integer managerId);
  List<Classroom> findByCourseId(Integer courseId);
}

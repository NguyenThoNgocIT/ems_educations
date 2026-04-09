package com.quanlydaotao.backend.enrollment;

import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface EnrollmentRepository extends JpaRepository<Enrollment, Integer> {
  List<Enrollment> findByStudentId(Integer studentId);
  List<Enrollment> findByCourseId(Integer courseId);
}

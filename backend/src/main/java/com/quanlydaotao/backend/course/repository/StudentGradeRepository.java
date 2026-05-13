package com.quanlydaotao.backend.course.repository;

import com.quanlydaotao.backend.course.entity.StudentGrade;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.UUID;
import java.util.List;
import java.util.Optional;

@Repository
public interface StudentGradeRepository extends JpaRepository<StudentGrade, UUID> {
    List<StudentGrade> findByStudentId(UUID studentId);
    Optional<StudentGrade> findByStudentIdAndCourseId(UUID studentId, UUID courseId);
}

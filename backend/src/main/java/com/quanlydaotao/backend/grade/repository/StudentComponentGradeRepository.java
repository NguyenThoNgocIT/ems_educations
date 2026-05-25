package com.quanlydaotao.backend.grade.repository;

import com.quanlydaotao.backend.grade.entity.StudentComponentGrade;
import com.quanlydaotao.backend.grade.entity.StudentComponentGradeId;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.UUID;

@Repository
public interface StudentComponentGradeRepository extends JpaRepository<StudentComponentGrade, StudentComponentGradeId> {
    List<StudentComponentGrade> findByCourseRegistrationCourseRegistrationIdAndIsActiveTrue(UUID courseRegistrationId);
}

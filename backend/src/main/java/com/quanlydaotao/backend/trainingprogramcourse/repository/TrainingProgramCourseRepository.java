package com.quanlydaotao.backend.trainingprogramcourse.repository;

import com.quanlydaotao.backend.trainingprogramcourse.entity.TrainingProgramCourse;
import com.quanlydaotao.backend.trainingprogramcourse.entity.TrainingProgramCourseId;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.UUID;

@Repository
public interface TrainingProgramCourseRepository extends JpaRepository<TrainingProgramCourse, TrainingProgramCourseId> {
    @Query("""
            SELECT c
            FROM TrainingProgramCourse c
            WHERE (:trainingProgramId IS NULL OR c.trainingProgramId = :trainingProgramId)
              AND (:semesterId IS NULL OR c.semesterId = :semesterId)
              AND (:coursePhase IS NULL OR c.coursePhase = :coursePhase)
              AND (:isRequired IS NULL OR c.isRequired = :isRequired)
              AND (:isActive IS NULL OR c.isActive = :isActive)
            ORDER BY c.sortOrder ASC, c.courseId ASC
            """)
    List<TrainingProgramCourse> search(UUID trainingProgramId, UUID semesterId, String coursePhase, Boolean isRequired, Boolean isActive);
}

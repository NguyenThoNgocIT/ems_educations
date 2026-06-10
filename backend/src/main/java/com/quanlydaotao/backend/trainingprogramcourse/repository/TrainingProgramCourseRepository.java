package com.quanlydaotao.backend.trainingprogramcourse.repository;

import com.quanlydaotao.backend.trainingprogramcourse.entity.TrainingProgramCourse;
import com.quanlydaotao.backend.trainingprogramcourse.entity.TrainingProgramCourseId;
import com.quanlydaotao.backend.trainingprogramcourse.dto.TrainingProgramCourseResponse;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.UUID;

@Repository
public interface TrainingProgramCourseRepository extends JpaRepository<TrainingProgramCourse, TrainingProgramCourseId> {
    boolean existsByTrainingProgramIdAndCourseIdAndIsActiveTrue(UUID trainingProgramId, UUID courseId);

    @Query("""
            SELECT new com.quanlydaotao.backend.trainingprogramcourse.dto.TrainingProgramCourseResponse(
                tpc.trainingProgramId,
                tp.code,
                tp.name,
                tpc.courseId,
                crs.code,
                crs.name,
                crs.courseType,
                tpc.semesterId,
                semester.code,
                semester.name,
                tpc.isRequired,
                tpc.groupCode,
                tpc.credits,
                tpc.prerequisiteCourseId,
                prerequisiteCourse.code,
                prerequisiteCourse.name,
                tpc.isPrerequisiteRequired,
                tpc.note,
                tpc.sortOrder,
                tpc.status,
                tpc.coursePhase,
                tpc.isActive
            )
            FROM TrainingProgramCourse tpc
            LEFT JOIN tpc.trainingProgram tp
            LEFT JOIN tpc.course crs
            LEFT JOIN tpc.semester semester
            LEFT JOIN tpc.prerequisiteCourse prerequisiteCourse
            WHERE (:trainingProgramId IS NULL OR tpc.trainingProgramId = :trainingProgramId)
              AND (:semesterId IS NULL OR tpc.semesterId = :semesterId)
              AND (:coursePhase IS NULL OR tpc.coursePhase = :coursePhase)
              AND (:isRequired IS NULL OR tpc.isRequired = :isRequired)
              AND (:isActive IS NULL OR tpc.isActive = :isActive)
            ORDER BY tpc.sortOrder ASC, crs.code ASC
            """)
    List<TrainingProgramCourseResponse> searchResponses(
            @Param("trainingProgramId") UUID trainingProgramId,
            @Param("semesterId") UUID semesterId,
            @Param("coursePhase") String coursePhase,
            @Param("isRequired") Boolean isRequired,
            @Param("isActive") Boolean isActive);
}

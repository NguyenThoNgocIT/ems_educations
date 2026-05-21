package com.quanlydaotao.backend.teachingassignment.repository;

import com.quanlydaotao.backend.teachingassignment.entity.TeachingAssignment;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Repository
public interface TeachingAssignmentRepository extends JpaRepository<TeachingAssignment, UUID> {
    Optional<TeachingAssignment> findByInstructorIdAndCourseClassIdAndClassIdAndSemesterId(UUID instructorId, UUID courseClassId, UUID classId, UUID semesterId);

    boolean existsByCourseClassIdAndSemesterIdAndIsActiveTrue(UUID courseClassId, UUID semesterId);

    boolean existsByInstructorIdAndCourseClassIdAndSemesterIdAndIsActiveTrue(UUID instructorId, UUID courseClassId, UUID semesterId);

    @Query("""
            SELECT a
            FROM TeachingAssignment a
            WHERE (:instructorId IS NULL OR a.instructorId = :instructorId)
              AND (:courseClassId IS NULL OR a.courseClassId = :courseClassId)
              AND (:classId IS NULL OR a.classId = :classId)
              AND (:semesterId IS NULL OR a.semesterId = :semesterId)
              AND (:isActive IS NULL OR a.isActive = :isActive)
            ORDER BY a.createdAt DESC
            """)
    List<TeachingAssignment> search(UUID instructorId, UUID courseClassId, UUID classId, UUID semesterId, Boolean isActive);
}

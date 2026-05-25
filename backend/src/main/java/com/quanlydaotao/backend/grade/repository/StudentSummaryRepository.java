package com.quanlydaotao.backend.grade.repository;

import com.quanlydaotao.backend.grade.entity.StudentSummary;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Repository
public interface StudentSummaryRepository extends JpaRepository<StudentSummary, UUID> {
    @Query("""
            SELECT s
            FROM StudentSummary s
            JOIN s.courseRegistration r
            JOIN r.courseClass cc
            WHERE r.studentId = :studentId
              AND cc.courseId = :courseId
              AND s.isActive = true
              AND s.isFinalized = true
            ORDER BY r.registeredAt DESC, s.createdAt DESC
            """)
    List<StudentSummary> findFinalizedByStudentAndCourse(UUID studentId, UUID courseId);

    @Query("""
            SELECT s
            FROM StudentSummary s
            JOIN s.courseRegistration r
            WHERE r.studentId = :studentId
              AND s.isActive = true
              AND s.isFinalized = true
            ORDER BY r.registeredAt DESC, s.createdAt DESC
            """)
    List<StudentSummary> findFinalizedByStudent(UUID studentId);

    default Optional<StudentSummary> findLatestFinalizedByStudentAndCourse(UUID studentId, UUID courseId) {
        return findFinalizedByStudentAndCourse(studentId, courseId).stream().findFirst();
    }
}

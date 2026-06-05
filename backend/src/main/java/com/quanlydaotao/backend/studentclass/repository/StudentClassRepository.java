package com.quanlydaotao.backend.studentclass.repository;

import com.quanlydaotao.backend.studentclass.entity.StudentClass;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.UUID;

@Repository
public interface StudentClassRepository extends JpaRepository<StudentClass, UUID> {
    @Query("""
            SELECT sc
            FROM StudentClass sc
            WHERE sc.studentId = :studentId
              AND sc.classId = :classId
              AND sc.semesterId = :semesterId
            ORDER BY CASE WHEN sc.isActive = true THEN 1 ELSE 0 END DESC,
                     sc.createdAt DESC,
                     sc.studentClassId DESC
            """)
    List<StudentClass> findByStudentIdAndClassIdAndSemesterId(UUID studentId, UUID classId, UUID semesterId);

    @Query("""
            SELECT sc
            FROM StudentClass sc
            WHERE sc.studentId = :studentId
              AND sc.isActive = true
            ORDER BY sc.createdAt DESC,
                     sc.studentClassId DESC
            """)
    List<StudentClass> findByStudentIdAndIsActiveTrue(UUID studentId);

    @Query("""
            SELECT sc
            FROM StudentClass sc
            WHERE sc.studentId = :studentId
              AND sc.semesterId = :semesterId
              AND sc.isActive = true
            ORDER BY sc.createdAt DESC,
                     sc.studentClassId DESC
            """)
    List<StudentClass> findByStudentIdAndSemesterIdAndIsActiveTrue(UUID studentId, UUID semesterId);

    @Query("""
            SELECT sc
            FROM StudentClass sc
            WHERE (:studentId IS NULL OR sc.studentId = :studentId)
              AND (:classId IS NULL OR sc.classId = :classId)
              AND (:semesterId IS NULL OR sc.semesterId = :semesterId)
              AND (:isActive IS NULL OR sc.isActive = :isActive)
            ORDER BY sc.createdAt DESC
            """)
    List<StudentClass> search(UUID studentId, UUID classId, UUID semesterId, Boolean isActive);

    @Query("""
            SELECT COUNT(sc)
            FROM StudentClass sc
            WHERE sc.classId = :classId
              AND sc.semesterId = :semesterId
              AND sc.isActive = true
              AND (:ignoredStudentClassId IS NULL OR sc.studentClassId <> :ignoredStudentClassId)
            """)
    long countActiveStudentsInClass(UUID classId, UUID semesterId, UUID ignoredStudentClassId);
}

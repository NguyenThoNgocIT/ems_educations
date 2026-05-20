package com.quanlydaotao.backend.studentclass.repository;

import com.quanlydaotao.backend.studentclass.entity.StudentClass;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Repository
public interface StudentClassRepository extends JpaRepository<StudentClass, UUID> {
    Optional<StudentClass> findByStudentIdAndClassIdAndSemesterId(UUID studentId, UUID classId, UUID semesterId);

    List<StudentClass> findByStudentIdAndIsActiveTrue(UUID studentId);

    Optional<StudentClass> findByStudentIdAndSemesterIdAndIsActiveTrue(UUID studentId, UUID semesterId);

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
}

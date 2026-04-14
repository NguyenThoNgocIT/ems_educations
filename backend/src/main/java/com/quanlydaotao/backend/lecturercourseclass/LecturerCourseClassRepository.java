package com.quanlydaotao.backend.lecturercourseclass;

import java.util.List;
import java.util.Optional;
import java.util.UUID;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

@Repository
public interface LecturerCourseClassRepository extends JpaRepository<LecturerCourseClass, UUID> {

    Optional<LecturerCourseClass> findByLecturerIdAndCourseClassIdAndIsActiveTrue(UUID lecturerId, UUID courseClassId);

    Optional<LecturerCourseClass> findByIdAndIsActiveTrue(UUID id);

    List<LecturerCourseClass> findByIsActiveTrue();

    List<LecturerCourseClass> findByLecturerIdAndIsActiveTrue(UUID lecturerId);

    List<LecturerCourseClass> findByCourseClassIdAndIsActiveTrue(UUID courseClassId);

    @Query("SELECT l FROM LecturerCourseClass l WHERE l.isActive = true"
            + " AND (:lecturerId IS NULL OR l.lecturerId = :lecturerId)"
            + " AND (:courseClassId IS NULL OR l.courseClassId = :courseClassId)"
            + " AND (:role IS NULL OR LOWER(l.role) LIKE LOWER(CONCAT('%', :role, '%')))"
            + " AND (:isActive IS NULL OR l.isActive = :isActive)")
    List<LecturerCourseClass> searchActiveByParams(
            @Param("lecturerId") UUID lecturerId,
            @Param("courseClassId") UUID courseClassId,
            @Param("role") String role,
            @Param("isActive") Boolean isActive
    );
}

package com.quanlydaotao.backend.courseclass;

import java.util.List;
import java.util.Optional;
import java.util.UUID;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

@Repository
public interface CourseClassRepository extends JpaRepository<CourseClass, UUID> {

    Optional<CourseClass> findByClassCode(String classCode);

    Optional<CourseClass> findByIdAndIsActiveTrue(UUID id);

    List<CourseClass> findByIsActiveTrue();

    List<CourseClass> findByStatusAndIsActiveTrue(Integer status);

    @Query("SELECT c FROM CourseClass c WHERE c.isActive = true"
            + " AND (:keyword IS NULL OR LOWER(c.classCode) LIKE LOWER(CONCAT('%', :keyword, '%')))"
            + " AND (:courseId IS NULL OR c.courseId = :courseId)"
            + " AND (:semesterId IS NULL OR c.semesterId = :semesterId)"
            + " AND (:status IS NULL OR c.status = :status)"
            + " AND (:room IS NULL OR LOWER(c.room) LIKE LOWER(CONCAT('%', :room, '%')))"
    )
    List<CourseClass> searchActiveByParams(
            @Param("keyword") String keyword,
            @Param("courseId") UUID courseId,
            @Param("semesterId") UUID semesterId,
            @Param("status") Integer status,
            @Param("room") String room
    );
}

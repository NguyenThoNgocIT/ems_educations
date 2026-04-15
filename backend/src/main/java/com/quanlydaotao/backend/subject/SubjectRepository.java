package com.quanlydaotao.backend.subject;

import java.util.List;
import java.util.Optional;
import java.util.UUID;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

@Repository
public interface SubjectRepository extends JpaRepository<Subject, UUID> {

    Optional<Subject> findByCourseCode(String courseCode);

    Optional<Subject> findByIdAndIsActiveTrue(UUID id);

    List<Subject> findByIsActiveTrue();

    Page<Subject> findByIsActiveTrue(Pageable pageable);
    Optional<Subject> findByCourseCodeIgnoreCase(String courseCode);

    List<Subject> findByProgramIdAndIsActiveTrue(UUID programId);
    @Query("SELECT s FROM Subject s WHERE s.isActive = true AND (LOWER(s.courseCode) LIKE LOWER(CONCAT('%', :keyword, '%')) OR LOWER(s.courseName) LIKE LOWER(CONCAT('%', :keyword, '%')) OR LOWER(s.description) LIKE LOWER(CONCAT('%', :keyword, '%')))")
    List<Subject> searchActiveByKeyword(@Param("keyword") String keyword);
}

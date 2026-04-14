package com.quanlydaotao.backend.lecturer;

import java.util.List;
import java.util.Optional;
import java.util.UUID;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

@Repository
public interface LecturerRepository extends JpaRepository<Lecturer, UUID> {

    Optional<Lecturer> findByLecturerCode(String lecturerCode);

    List<Lecturer> findByIsActiveTrue();

    List<Lecturer> findByIsActiveTrueAndDepartmentId(String departmentId);

    @Query("SELECT l FROM Lecturer l WHERE l.isActive = true AND (LOWER(l.lecturerCode) LIKE LOWER(CONCAT('%', :keyword, '%')) OR LOWER(l.fullName) LIKE LOWER(CONCAT('%', :keyword, '%')) OR LOWER(l.email) LIKE LOWER(CONCAT('%', :keyword, '%')))")
    List<Lecturer> searchActiveByKeyword(@Param("keyword") String keyword);
}

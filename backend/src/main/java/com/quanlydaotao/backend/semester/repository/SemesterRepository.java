package com.quanlydaotao.backend.semester.repository;

import com.quanlydaotao.backend.semester.entity.Semester;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

public interface SemesterRepository extends JpaRepository<Semester, String>, JpaSpecificationExecutor<Semester> {
    
    @Query("SELECT s FROM Semester s WHERE s.deletedAt IS NULL")
    List<Semester> findAllActive();
    
    @Query("SELECT s FROM Semester s WHERE s.semesterId = :id AND s.deletedAt IS NULL")
    Optional<Semester> findActiveById(@Param("id") String id);
    
    Optional<Semester> findByCodeAndDeletedAtIsNull(String code);
    
    List<Semester> findBySchoolYear_SchoolYearIdAndDeletedAtIsNull(String schoolYearId);
    
    boolean existsByCodeAndDeletedAtIsNull(String code);
    
    @Query("SELECT s FROM Semester s WHERE s.status = :status AND s.deletedAt IS NULL")
    List<Semester> findByStatus(@Param("status") Integer status);
    
    @Query("SELECT s FROM Semester s WHERE s.isActive = true AND s.deletedAt IS NULL")
    Optional<Semester> findActiveSemester();
    
    @Query("SELECT s FROM Semester s WHERE s.startDate <= :currentDate AND s.endDate >= :currentDate AND s.deletedAt IS NULL")
    Optional<Semester> findCurrentSemester(@Param("currentDate") LocalDate currentDate);
}
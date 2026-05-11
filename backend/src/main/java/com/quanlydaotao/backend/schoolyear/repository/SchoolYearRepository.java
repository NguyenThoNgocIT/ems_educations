package com.quanlydaotao.backend.schoolyear.repository;

import com.quanlydaotao.backend.schoolyear.entity.SchoolYear;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import java.time.LocalDate;
import java.util.Optional;

public interface SchoolYearRepository extends JpaRepository<SchoolYear, String>, JpaSpecificationExecutor<SchoolYear> {
    
    @Query("SELECT sy FROM SchoolYear sy WHERE sy.schoolYearId = :id AND sy.deletedAt IS NULL")
    Optional<SchoolYear> findActiveById(@Param("id") String id);
    
    @Query("SELECT sy FROM SchoolYear sy WHERE sy.deletedAt IS NULL")
    java.util.List<SchoolYear> findAllActive();
    
    Optional<SchoolYear> findByCodeAndDeletedAtIsNull(String code);
    
    boolean existsByCodeAndDeletedAtIsNull(String code);
    
    @Query("SELECT sy FROM SchoolYear sy WHERE sy.startDate <= :date AND sy.endDate >= :date AND sy.deletedAt IS NULL")
    Optional<SchoolYear> findCurrentSchoolYear(@Param("date") LocalDate date);
    
    @Query("SELECT sy FROM SchoolYear sy WHERE sy.isActive = true AND sy.deletedAt IS NULL ORDER BY sy.startDate DESC")
    java.util.List<SchoolYear> findAllActiveOrderByStartDateDesc();
}
package com.quanlydaotao.backend.registration.repository;

import com.quanlydaotao.backend.registration.entity.CourseRegistration;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

public interface CourseRegistrationRepository extends JpaRepository<CourseRegistration, UUID>, JpaSpecificationExecutor<CourseRegistration> {

    Page<CourseRegistration> findByStudentId(UUID studentId, Pageable pageable);
    
    Page<CourseRegistration> findByCourseClassId(UUID courseClassId, Pageable pageable);
    
    List<CourseRegistration> findByStudentIdAndStatus(UUID studentId, Integer status);
    
    boolean existsByStudentIdAndCourseClassIdAndStatusNot(UUID studentId, UUID courseClassId, Integer status);
    
    @Query("SELECT cr FROM CourseRegistration cr WHERE cr.studentId = :studentId AND cr.status = 1")
    List<CourseRegistration> findActiveRegistrationsByStudent(@Param("studentId") UUID studentId);
}
package com.quanlydaotao.backend.classmanagement.repository;

import com.quanlydaotao.backend.classmanagement.entity.Class;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

public interface ClassRepository extends JpaRepository<Class, UUID>, JpaSpecificationExecutor<Class> {

    Optional<Class> findByClassCode(String classCode);

    boolean existsByClassCode(String classCode);

    List<Class> findByDepartmentId(String departmentId);

    List<Class> findByAcademicCohortId(String academicCohortId);

    @Query("SELECT c FROM Class c WHERE c.classCode = :classCode AND c.deletedAt IS NULL")
    Optional<Class> findActiveByClassCode(@Param("classCode") String classCode);
}
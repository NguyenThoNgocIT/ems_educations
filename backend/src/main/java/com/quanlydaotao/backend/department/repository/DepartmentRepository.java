package com.quanlydaotao.backend.department.repository;

import com.quanlydaotao.backend.department.entity.Department;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.Optional;
import java.util.UUID;

public interface DepartmentRepository extends JpaRepository<Department, UUID>, JpaSpecificationExecutor<Department> {

    Optional<Department> findByCode(String code);

    boolean existsByCode(String code);

    @Query("SELECT d FROM Department d WHERE d.code = :code AND d.deletedAt IS NULL")
    Optional<Department> findActiveByCode(@Param("code") String code);
}
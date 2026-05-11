package com.quanlydaotao.backend.major.repository;

import com.quanlydaotao.backend.major.entity.Major;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

public interface MajorRepository extends JpaRepository<Major, UUID>, JpaSpecificationExecutor<Major> {

    Optional<Major> findByCode(String code);

    boolean existsByCode(String code);

    List<Major> findByDepartmentId(String departmentId);

    @Query("SELECT m FROM Major m WHERE m.code = :code AND m.deletedAt IS NULL")
    Optional<Major> findActiveByCode(@Param("code") String code);
}
package com.quanlydaotao.backend.department.repository;

import com.quanlydaotao.backend.department.entity.Department;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Repository
public interface DepartmentRepository extends JpaRepository<Department, UUID> {
    Optional<Department> findByCode(String code);

    @Query("""
            SELECT d
            FROM Department d
            WHERE (:keyword IS NULL OR LOWER(d.code) LIKE LOWER(CONCAT('%', :keyword, '%'))
                   OR LOWER(d.name) LIKE LOWER(CONCAT('%', :keyword, '%')))
              AND (:isActive IS NULL OR d.isActive = :isActive)
            ORDER BY d.code ASC
            """)
    List<Department> search(String keyword, Boolean isActive);
}




package com.quanlydaotao.backend.department;

import java.util.List;
import java.util.Optional;
import java.util.UUID;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface DepartmentRepository extends JpaRepository<Department, UUID> {

    Optional<Department> findByDepartmentCode(String departmentCode);

    List<Department> findByDepartmentCodeContainingIgnoreCaseOrNameContainingIgnoreCase(
            String departmentCode,
            String name
    );
}

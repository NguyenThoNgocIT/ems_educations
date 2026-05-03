package com.quanlydaotao.backend.user.repository;
import com.quanlydaotao.backend.user.entity.Employee;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.Optional;
import java.util.UUID;
@Repository
public interface EmployeeRepository extends JpaRepository<Employee, UUID> {
    Optional<Employee> findByEmployeeCode(String employeeCode);
    Optional<Employee> findByPersonId(UUID personId);
}


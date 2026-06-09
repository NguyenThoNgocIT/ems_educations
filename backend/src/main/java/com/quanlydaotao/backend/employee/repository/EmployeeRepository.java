package com.quanlydaotao.backend.employee.repository;
import com.quanlydaotao.backend.employee.entity.Employee;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.Collection;
import java.util.List;
import java.util.Optional;
import java.util.UUID;
@Repository
public interface EmployeeRepository extends JpaRepository<Employee, UUID> {
    Optional<Employee> findByEmployeeCode(String employeeCode);
    Optional<Employee> findByPersonPersonId(UUID personId);
    List<Employee> findByPersonPersonIdIn(Collection<UUID> personIds);
}




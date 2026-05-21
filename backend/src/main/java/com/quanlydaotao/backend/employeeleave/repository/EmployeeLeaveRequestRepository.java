package com.quanlydaotao.backend.employeeleave.repository;

import com.quanlydaotao.backend.employeeleave.entity.EmployeeLeaveRequest;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.UUID;

@Repository
public interface EmployeeLeaveRequestRepository extends JpaRepository<EmployeeLeaveRequest, UUID> {
    @Query("""
            SELECT COUNT(l) > 0
            FROM EmployeeLeaveRequest l
            WHERE l.employeeId = :employeeId
              AND l.isActive = true
              AND l.status = 1
              AND l.fromDate <= :date
              AND l.toDate >= :date
            """)
    boolean hasApprovedLeaveOnDate(UUID employeeId, LocalDate date);
}

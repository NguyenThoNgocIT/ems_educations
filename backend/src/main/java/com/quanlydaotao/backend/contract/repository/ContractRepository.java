package com.quanlydaotao.backend.contract.repository;

import com.quanlydaotao.backend.contract.entity.Contract;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Repository
public interface ContractRepository extends JpaRepository<Contract, UUID> {
    Optional<Contract> findByContractNo(String contractNo);

    @Query("""
            SELECT c
            FROM Contract c
            WHERE (:keyword IS NULL OR LOWER(c.contractNo) LIKE LOWER(CONCAT('%', :keyword, '%'))
                   OR LOWER(c.contractType) LIKE LOWER(CONCAT('%', :keyword, '%')))
              AND (:employeeId IS NULL OR c.employee.employeeId = :employeeId)
              AND (:status IS NULL OR c.status = :status)
              AND (:isActive IS NULL OR c.isActive = :isActive)
            ORDER BY c.effectiveDate DESC, c.contractNo ASC
            """)
    List<Contract> search(String keyword, UUID employeeId, Integer status, Boolean isActive);
}

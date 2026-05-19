package com.quanlydaotao.backend.contract.service.impl;

import com.quanlydaotao.backend.common.exception.BusinessException;
import com.quanlydaotao.backend.common.exception.ResourceNotFoundException;
import com.quanlydaotao.backend.contract.dto.ContractDto;
import com.quanlydaotao.backend.contract.entity.Contract;
import com.quanlydaotao.backend.contract.repository.ContractRepository;
import com.quanlydaotao.backend.contract.service.ContractService;
import com.quanlydaotao.backend.employee.entity.Employee;
import com.quanlydaotao.backend.employee.repository.EmployeeRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.util.StringUtils;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class ContractServiceImpl implements ContractService {
    private final ContractRepository contractRepository;
    private final EmployeeRepository employeeRepository;

    @Override
    @Transactional(readOnly = true)
    public List<ContractDto> searchContracts(String keyword, UUID employeeId, Integer status, Boolean isActive) {
        return contractRepository.search(normalizeBlank(keyword), employeeId, status, isActive).stream()
                .map(this::toDto)
                .toList();
    }

    @Override
    @Transactional(readOnly = true)
    public ContractDto getContract(UUID id) {
        return toDto(findContract(id));
    }

    @Override
    @Transactional
    public ContractDto createContract(ContractDto request) {
        validateRequired(request);
        validateFields(request);
        if (StringUtils.hasText(request.getContractNo())) {
            contractRepository.findByContractNo(request.getContractNo().trim()).ifPresent(existing -> {
                throw new BusinessException("Số hợp đồng đã tồn tại");
            });
        }
        Employee employee = employeeRepository.findById(request.getEmployeeId())
                .orElseThrow(() -> new ResourceNotFoundException("Không tìm thấy nhân sự của hợp đồng"));

        Contract contract = new Contract();
        contract.setEmployee(employee);
        contract.setContractNo(normalizeBlank(request.getContractNo()));
        contract.setContractType(request.getContractType().trim());
        contract.setStatus(request.getStatus() == null ? 1 : request.getStatus());
        apply(contract, request);
        contract.setIsActive(request.getIsActive() == null || request.getIsActive());
        return toDto(contractRepository.save(contract));
    }

    @Override
    @Transactional
    public ContractDto updateContract(UUID id, ContractDto request) {
        Contract contract = findContract(id);
        validateFields(request);
        if (request.getEmployeeId() != null) {
            Employee employee = employeeRepository.findById(request.getEmployeeId())
                    .orElseThrow(() -> new ResourceNotFoundException("Không tìm thấy nhân sự của hợp đồng"));
            contract.setEmployee(employee);
        }
        if (StringUtils.hasText(request.getContractNo())) {
            String contractNo = request.getContractNo().trim();
            contractRepository.findByContractNo(contractNo)
                    .filter(existing -> !existing.getContractId().equals(id))
                    .ifPresent(existing -> {
                        throw new BusinessException("Số hợp đồng đã tồn tại");
                    });
            contract.setContractNo(contractNo);
        }
        if (StringUtils.hasText(request.getContractType())) contract.setContractType(request.getContractType().trim());
        if (request.getStatus() != null) contract.setStatus(request.getStatus());
        apply(contract, request);
        return toDto(contractRepository.save(contract));
    }

    @Override
    @Transactional
    public void deleteContract(UUID id) {
        Contract contract = findContract(id);
        contract.setIsActive(false);
        contract.setDeletedAt(LocalDateTime.now());
        contractRepository.save(contract);
    }

    private Contract findContract(UUID id) {
        return contractRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Không tìm thấy hợp đồng"));
    }

    private void validateRequired(ContractDto request) {
        if (request.getEmployeeId() == null || !StringUtils.hasText(request.getContractType())) {
            throw new BusinessException("Nhân sự và loại hợp đồng không được để trống");
        }
    }

    private void validateFields(ContractDto request) {
        if (request.getEffectiveDate() != null && request.getExpiredDate() != null
                && request.getEffectiveDate().isAfter(request.getExpiredDate())) {
            throw new BusinessException("Ngày hiệu lực hợp đồng phải nhỏ hơn hoặc bằng ngày hết hạn");
        }
        if (request.getBaseSalary() != null && request.getBaseSalary().compareTo(BigDecimal.ZERO) < 0) {
            throw new BusinessException("Lương cơ bản không được âm");
        }
        if (request.getAllowance() != null && request.getAllowance().compareTo(BigDecimal.ZERO) < 0) {
            throw new BusinessException("Phụ cấp hợp đồng không được âm");
        }
        if (request.getAnnualLeave() != null && request.getAnnualLeave() < 0) {
            throw new BusinessException("Số ngày phép năm không được âm");
        }
    }

    private void apply(Contract contract, ContractDto request) {
        if (request.getSignedDate() != null) contract.setSignedDate(request.getSignedDate());
        if (request.getEffectiveDate() != null) contract.setEffectiveDate(request.getEffectiveDate());
        if (request.getExpiredDate() != null) contract.setExpiredDate(request.getExpiredDate());
        if (request.getBaseSalary() != null) contract.setBaseSalary(request.getBaseSalary());
        if (request.getNote() != null) contract.setNote(request.getNote());
        if (request.getAllowance() != null) contract.setAllowance(request.getAllowance());
        if (request.getSignedBy() != null) contract.setSignedBy(request.getSignedBy());
        if (request.getAnnualLeave() != null) contract.setAnnualLeave(request.getAnnualLeave());
        if (request.getIsActive() != null) contract.setIsActive(request.getIsActive());
    }

    private ContractDto toDto(Contract contract) {
        return ContractDto.builder()
                .contractId(contract.getContractId())
                .employeeId(contract.getEmployee().getEmployeeId())
                .contractNo(contract.getContractNo())
                .contractType(contract.getContractType())
                .signedDate(contract.getSignedDate())
                .effectiveDate(contract.getEffectiveDate())
                .expiredDate(contract.getExpiredDate())
                .baseSalary(contract.getBaseSalary())
                .status(contract.getStatus())
                .note(contract.getNote())
                .allowance(contract.getAllowance())
                .signedBy(contract.getSignedBy())
                .annualLeave(contract.getAnnualLeave())
                .isActive(contract.getIsActive())
                .build();
    }

    private String normalizeBlank(String value) {
        return StringUtils.hasText(value) ? value.trim() : null;
    }
}

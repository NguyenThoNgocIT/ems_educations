package com.quanlydaotao.backend.contract.service.impl;

import com.quanlydaotao.backend.common.exception.BusinessException;
import com.quanlydaotao.backend.common.exception.ResourceNotFoundException;
import com.quanlydaotao.backend.contract.dto.ContractDto;
import com.quanlydaotao.backend.contract.entity.Contract;
import com.quanlydaotao.backend.contract.mapper.ContractMapper;
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
    private final ContractMapper contractMapper;

    @Override
    @Transactional(readOnly = true)
    public List<ContractDto> searchContracts(String keyword, UUID employeeId, Integer status, Boolean isActive) {
        return contractMapper.toDtoList(contractRepository.search(normalizeBlank(keyword), employeeId, status, isActive));
    }

    @Override
    @Transactional(readOnly = true)
    public ContractDto getContract(UUID id) {
        return contractMapper.toDto(findContract(id));
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

        Contract contract = contractMapper.toEntity(request);
        contract.setEmployee(employee);
        contract.setContractNo(normalizeBlank(request.getContractNo()));
        contract.setContractType(request.getContractType().trim());
        contract.setStatus(request.getStatus() == null ? 1 : request.getStatus());
        contract.setIsActive(request.getIsActive() == null || request.getIsActive());
        return contractMapper.toDto(contractRepository.save(contract));
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
        contractMapper.updateEntityFromDto(request, contract);
        if (StringUtils.hasText(request.getContractNo())) contract.setContractNo(request.getContractNo().trim());
        if (StringUtils.hasText(request.getContractType())) contract.setContractType(request.getContractType().trim());
        return contractMapper.toDto(contractRepository.save(contract));
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

    private String normalizeBlank(String value) {
        return StringUtils.hasText(value) ? value.trim() : null;
    }
}

package com.quanlydaotao.backend.contract.service;

import com.quanlydaotao.backend.contract.dto.ContractDto;

import java.util.List;
import java.util.UUID;

public interface ContractService {
    List<ContractDto> searchContracts(String keyword, UUID employeeId, Integer status, Boolean isActive);

    ContractDto getContract(UUID id);

    ContractDto createContract(ContractDto request);

    ContractDto updateContract(UUID id, ContractDto request);

    void deleteContract(UUID id);
}

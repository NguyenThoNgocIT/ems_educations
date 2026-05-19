package com.quanlydaotao.backend.employee.service.impl;

import com.quanlydaotao.backend.common.exception.ResourceNotFoundException;
import com.quanlydaotao.backend.employee.dto.EmployeeAdminResponse;
import com.quanlydaotao.backend.employee.entity.Employee;
import com.quanlydaotao.backend.employee.mapper.EmployeeMapper;
import com.quanlydaotao.backend.employee.repository.EmployeeRepository;
import com.quanlydaotao.backend.employee.service.EmployeeService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class EmployeeServiceImpl implements EmployeeService {
    private final EmployeeRepository employeeRepository;
    private final EmployeeMapper employeeMapper;

    @Override
    @Transactional(readOnly = true)
    public List<EmployeeAdminResponse> getAllEmployeesForAdmin() {
        return employeeMapper.toDtoList(employeeRepository.findAll());
    }

    @Override
    @Transactional(readOnly = true)
    public EmployeeAdminResponse getEmployeeForAdmin(UUID id) {
        return employeeMapper.toDto(findEmployee(id));
    }

    private Employee findEmployee(UUID id) {
        return employeeRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Không tìm thấy nhân viên"));
    }

}

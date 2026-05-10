package com.quanlydaotao.backend.department.service.impl;

import com.quanlydaotao.backend.common.exception.BusinessException;
import com.quanlydaotao.backend.common.exception.ResourceNotFoundException;
import com.quanlydaotao.backend.department.dto.request.CreateDepartmentRequest;
import com.quanlydaotao.backend.department.dto.request.DepartmentSearchRequest;
import com.quanlydaotao.backend.department.dto.request.UpdateDepartmentRequest;
import com.quanlydaotao.backend.department.dto.response.DepartmentDetailResponse;
import com.quanlydaotao.backend.department.dto.response.DepartmentResponse;
import com.quanlydaotao.backend.department.entity.Department;
import com.quanlydaotao.backend.department.mapper.DepartmentMapper;
import com.quanlydaotao.backend.department.repository.DepartmentRepository;
import com.quanlydaotao.backend.department.service.DepartmentService;
import com.quanlydaotao.backend.department.spec.DepartmentSpecification;
import com.quanlydaotao.backend.department.validator.DepartmentValidator;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class DepartmentServiceImpl implements DepartmentService {

    private final DepartmentRepository departmentRepository;
    private final DepartmentMapper departmentMapper;
    private final DepartmentValidator departmentValidator;

    @Override
    @Transactional
    public DepartmentResponse createDepartment(CreateDepartmentRequest request) {
        departmentValidator.validateCreateDepartment(request);
        
        Department department = departmentMapper.toEntity(request);
        department = departmentRepository.save(department);
        
        return departmentMapper.toResponse(department);
    }

    @Override
    @Transactional
    public DepartmentResponse updateDepartment(String departmentId, UpdateDepartmentRequest request) {
        Department department = departmentRepository.findById(UUID.fromString(departmentId))
                .orElseThrow(() -> new ResourceNotFoundException("Không tìm thấy khoa với ID: " + departmentId));
        
        departmentValidator.validateUpdateDepartment(department, request);
        departmentMapper.updateEntity(request, department);
        
        department = departmentRepository.save(department);
        return departmentMapper.toResponse(department);
    }

    @Override
    @Transactional(readOnly = true)
    public DepartmentDetailResponse getDepartmentById(String departmentId) {
        Department department = departmentRepository.findById(UUID.fromString(departmentId))
                .orElseThrow(() -> new ResourceNotFoundException("Không tìm thấy khoa với ID: " + departmentId));
        
        return departmentMapper.toDetailResponse(department);
    }

    @Override
    @Transactional(readOnly = true)
    public Page<DepartmentResponse> searchDepartments(DepartmentSearchRequest request, Pageable pageable) {
        var spec = DepartmentSpecification.filterByCriteria(request);
        Page<Department> departments = departmentRepository.findAll(spec, pageable);
        return departments.map(departmentMapper::toResponse);
    }

    @Override
    @Transactional
    public void deleteDepartment(String departmentId) {
        Department department = departmentRepository.findById(UUID.fromString(departmentId))
                .orElseThrow(() -> new ResourceNotFoundException("Không tìm thấy khoa với ID: " + departmentId));
        
        departmentValidator.validateBeforeDelete(department);
        
        department.setDeletedAt(LocalDateTime.now());
        department.setIsActive(false);
        departmentRepository.save(department);
    }
}
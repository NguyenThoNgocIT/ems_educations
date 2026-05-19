package com.quanlydaotao.backend.department.service.impl;

import com.quanlydaotao.backend.common.exception.BusinessException;
import com.quanlydaotao.backend.common.exception.ResourceNotFoundException;
import com.quanlydaotao.backend.department.dto.DepartmentDto;
import com.quanlydaotao.backend.department.entity.Department;
import com.quanlydaotao.backend.department.repository.DepartmentRepository;
import com.quanlydaotao.backend.department.service.DepartmentService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.util.StringUtils;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Locale;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class DepartmentServiceImpl implements DepartmentService {
    private final DepartmentRepository departmentRepository;

    @Override
    @Transactional(readOnly = true)
    public List<DepartmentDto> searchDepartments(String keyword, Boolean isActive) {
        return departmentRepository.search(normalizeBlank(keyword), isActive).stream()
                .map(this::toDto)
                .toList();
    }

    @Override
    @Transactional(readOnly = true)
    public DepartmentDto getDepartment(UUID id) {
        return toDto(findDepartment(id));
    }

    @Override
    @Transactional
    public DepartmentDto createDepartment(DepartmentDto request) {
        validate(request);
        String code = normalizeCode(request.getCode());
        departmentRepository.findByCode(code).ifPresent(existing -> {
            throw new BusinessException("Mã khoa đã tồn tại");
        });
        Department department = new Department();
        department.setCode(code);
        apply(department, request);
        department.setIsActive(request.getIsActive() == null || request.getIsActive());
        return toDto(departmentRepository.save(department));
    }

    @Override
    @Transactional
    public DepartmentDto updateDepartment(UUID id, DepartmentDto request) {
        Department department = findDepartment(id);
        if (StringUtils.hasText(request.getCode())) {
            String code = normalizeCode(request.getCode());
            departmentRepository.findByCode(code)
                    .filter(existing -> !existing.getDepartmentId().equals(id))
                    .ifPresent(existing -> {
                        throw new BusinessException("Mã khoa đã tồn tại");
                    });
            department.setCode(code);
        }
        apply(department, request);
        return toDto(departmentRepository.save(department));
    }

    @Override
    @Transactional
    public void deleteDepartment(UUID id) {
        Department department = findDepartment(id);
        department.setIsActive(false);
        department.setDeletedAt(LocalDateTime.now());
        departmentRepository.save(department);
    }

    private Department findDepartment(UUID id) {
        return departmentRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Không tìm thấy khoa"));
    }

    private void validate(DepartmentDto request) {
        if (!StringUtils.hasText(request.getCode()) || !StringUtils.hasText(request.getName())) {
            throw new BusinessException("Mã khoa và tên khoa không được để trống");
        }
    }

    private void apply(Department department, DepartmentDto request) {
        if (request.getName() != null) department.setName(request.getName());
        if (request.getDescription() != null) department.setDescription(request.getDescription());
        if (request.getIsActive() != null) department.setIsActive(request.getIsActive());
    }

    private DepartmentDto toDto(Department department) {
        return DepartmentDto.builder()
                .departmentId(department.getDepartmentId())
                .code(department.getCode())
                .name(department.getName())
                .description(department.getDescription())
                .isActive(department.getIsActive())
                .build();
    }

    private String normalizeCode(String code) {
        return code.trim().toUpperCase(Locale.ROOT);
    }

    private String normalizeBlank(String value) {
        return StringUtils.hasText(value) ? value.trim() : null;
    }
}

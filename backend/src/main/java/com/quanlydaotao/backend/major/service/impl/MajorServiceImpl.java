package com.quanlydaotao.backend.major.service.impl;

import com.quanlydaotao.backend.common.exception.BusinessException;
import com.quanlydaotao.backend.common.exception.ResourceNotFoundException;
import com.quanlydaotao.backend.major.dto.MajorRequest;
import com.quanlydaotao.backend.major.dto.MajorResponse;
import com.quanlydaotao.backend.major.entity.Major;
import com.quanlydaotao.backend.major.repository.MajorRepository;
import com.quanlydaotao.backend.major.service.MajorService;
import com.quanlydaotao.backend.department.repository.DepartmentRepository;
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
public class MajorServiceImpl implements MajorService {
    private final MajorRepository majorRepository;
    private final DepartmentRepository departmentRepository;

    @Override
    @Transactional(readOnly = true)
    public List<MajorResponse> getAllMajors(String keyword, UUID departmentId, Boolean isActive) {
        return majorRepository.search(normalizeBlank(keyword), departmentId, isActive).stream()
                .map(this::mapToDto)
                .toList();
    }

    @Override
    @Transactional(readOnly = true)
    public MajorResponse getMajorById(UUID id) {
        return mapToDto(findMajor(id));
    }

    @Override
    @Transactional
    public MajorResponse createMajor(MajorRequest request) {
        validateRequest(request);
        String code = normalizeCode(request.getCode());
        majorRepository.findByCode(code).ifPresent(existing -> {
            throw new BusinessException("Mã ngành đã tồn tại");
        });
        validateDepartment(request.getDepartmentId());

        Major major = new Major();
        major.setCode(code);
        major.setName(request.getName().trim());
        major.setDescription(request.getDescription());
        major.setDepartmentId(request.getDepartmentId());
        major.setEffectiveDate(request.getEffectiveDate());
        major.setExpiryDate(request.getExpiryDate());
        major.setIsActive(request.getIsActive() == null || request.getIsActive());
        return mapToDto(majorRepository.save(major));
    }

    @Override
    @Transactional
    public MajorResponse updateMajor(UUID id, MajorRequest request) {
        Major major = findMajor(id);
        if (StringUtils.hasText(request.getCode())) {
            String code = normalizeCode(request.getCode());
            majorRepository.findByCode(code)
                    .filter(existing -> !existing.getMajorId().equals(id))
                    .ifPresent(existing -> {
                        throw new BusinessException("Mã ngành đã tồn tại");
                    });
            major.setCode(code);
        }
        if (request.getDepartmentId() != null) {
            validateDepartment(request.getDepartmentId());
            major.setDepartmentId(request.getDepartmentId());
        }
        if (StringUtils.hasText(request.getName())) major.setName(request.getName().trim());
        if (request.getDescription() != null) major.setDescription(request.getDescription());
        if (request.getEffectiveDate() != null) major.setEffectiveDate(request.getEffectiveDate());
        if (request.getExpiryDate() != null) major.setExpiryDate(request.getExpiryDate());
        if (request.getIsActive() != null) major.setIsActive(request.getIsActive());
        return mapToDto(majorRepository.save(major));
    }

    @Override
    @Transactional
    public void deleteMajor(UUID id) {
        Major major = findMajor(id);
        major.setIsActive(false);
        major.setDeletedAt(LocalDateTime.now());
        majorRepository.save(major);
    }

    private Major findMajor(UUID id) {
        return majorRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Không tìm thấy ngành"));
    }

    private void validateRequest(MajorRequest request) {
        if (!StringUtils.hasText(request.getCode()) || !StringUtils.hasText(request.getName()) || request.getDepartmentId() == null) {
            throw new BusinessException("Mã ngành, tên ngành và khoa không được để trống");
        }
    }

    private void validateDepartment(UUID departmentId) {
        if (!departmentRepository.existsById(departmentId)) {
            throw new ResourceNotFoundException("Không tìm thấy khoa của ngành");
        }
    }

    private MajorResponse mapToDto(Major major) {
        MajorResponse dto = new MajorResponse();
        dto.setMajorId(major.getMajorId());
        dto.setCode(major.getCode());
        dto.setName(major.getName());
        dto.setDescription(major.getDescription());
        dto.setDepartmentId(major.getDepartmentId());
        dto.setIsActive(major.getIsActive());
        dto.setEffectiveDate(major.getEffectiveDate());
        dto.setExpiryDate(major.getExpiryDate());
        return dto;
    }

    private String normalizeCode(String code) {
        return code.trim().toUpperCase(Locale.ROOT);
    }

    private String normalizeBlank(String value) {
        return StringUtils.hasText(value) ? value.trim() : null;
    }
}

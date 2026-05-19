package com.quanlydaotao.backend.major.service.impl;

import com.quanlydaotao.backend.common.exception.BusinessException;
import com.quanlydaotao.backend.common.exception.ResourceNotFoundException;
import com.quanlydaotao.backend.major.dto.MajorRequest;
import com.quanlydaotao.backend.major.dto.MajorResponse;
import com.quanlydaotao.backend.major.entity.Major;
import com.quanlydaotao.backend.major.mapper.MajorMapper;
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
    private final MajorMapper majorMapper;

    @Override
    @Transactional(readOnly = true)
    public List<MajorResponse> getAllMajors(String keyword, UUID departmentId, Boolean isActive) {
        return majorMapper.toDtoList(majorRepository.search(normalizeBlank(keyword), departmentId, isActive));
    }

    @Override
    @Transactional(readOnly = true)
    public MajorResponse getMajorById(UUID id) {
        return majorMapper.toDto(findMajor(id));
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

        Major major = majorMapper.toEntity(request);
        major.setCode(code);
        major.setName(request.getName().trim());
        major.setIsActive(request.getIsActive() == null || request.getIsActive());
        return majorMapper.toDto(majorRepository.save(major));
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
        }
        majorMapper.updateEntityFromDto(request, major);
        if (StringUtils.hasText(request.getCode())) major.setCode(normalizeCode(request.getCode()));
        if (StringUtils.hasText(request.getName())) major.setName(request.getName().trim());
        return majorMapper.toDto(majorRepository.save(major));
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

    private String normalizeCode(String code) {
        return code.trim().toUpperCase(Locale.ROOT);
    }

    private String normalizeBlank(String value) {
        return StringUtils.hasText(value) ? value.trim() : null;
    }
}

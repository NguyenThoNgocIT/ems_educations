package com.quanlydaotao.backend.specialization.service.impl;

import com.quanlydaotao.backend.common.exception.BusinessException;
import com.quanlydaotao.backend.common.exception.ResourceNotFoundException;
import com.quanlydaotao.backend.department.repository.DepartmentRepository;
import com.quanlydaotao.backend.major.entity.Major;
import com.quanlydaotao.backend.major.repository.MajorRepository;
import com.quanlydaotao.backend.specialization.dto.SpecializationRequest;
import com.quanlydaotao.backend.specialization.dto.SpecializationResponse;
import com.quanlydaotao.backend.specialization.entity.Specialization;
import com.quanlydaotao.backend.specialization.mapper.SpecializationMapper;
import com.quanlydaotao.backend.specialization.repository.SpecializationRepository;
import com.quanlydaotao.backend.specialization.service.SpecializationService;
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
public class SpecializationServiceImpl implements SpecializationService {
    private final SpecializationRepository specializationRepository;
    private final DepartmentRepository departmentRepository;
    private final MajorRepository majorRepository;
    private final SpecializationMapper specializationMapper;

    @Override
    @Transactional(readOnly = true)
    public List<SpecializationResponse> search(String keyword, UUID departmentId, UUID majorId, Boolean isActive) {
        return specializationMapper.toDtoList(specializationRepository.search(normalizeBlank(keyword), departmentId, majorId, isActive));
    }

    @Override
    @Transactional(readOnly = true)
    public SpecializationResponse getSpecialization(UUID id) {
        return specializationMapper.toDto(findSpecialization(id));
    }

    @Override
    @Transactional
    public SpecializationResponse createSpecialization(SpecializationRequest request) {
        validateReferences(request.getDepartmentId(), request.getMajorId());
        String code = normalizeCode(request.getCode());
        specializationRepository.findByCode(code).ifPresent(existing -> {
            throw new BusinessException("Mã chuyên ngành đã tồn tại");
        });
        Specialization specialization = specializationMapper.toEntity(request);
        specialization.setCode(code);
        specialization.setName(request.getName().trim());
        specialization.setIsActive(request.getIsActive() == null || request.getIsActive());
        return specializationMapper.toDto(specializationRepository.save(specialization));
    }

    @Override
    @Transactional
    public SpecializationResponse updateSpecialization(UUID id, SpecializationRequest request) {
        Specialization specialization = findSpecialization(id);
        UUID departmentId = request.getDepartmentId() != null ? request.getDepartmentId() : specialization.getDepartmentId();
        UUID majorId = request.getMajorId() != null ? request.getMajorId() : specialization.getMajorId();
        validateReferences(departmentId, majorId);
        if (StringUtils.hasText(request.getCode())) {
            String code = normalizeCode(request.getCode());
            specializationRepository.findByCode(code)
                    .filter(existing -> !existing.getSpecializationId().equals(id))
                    .ifPresent(existing -> {
                        throw new BusinessException("Mã chuyên ngành đã tồn tại");
                    });
            specialization.setCode(code);
        }
        specializationMapper.updateEntityFromDto(request, specialization);
        if (StringUtils.hasText(request.getName())) {
            specialization.setName(request.getName().trim());
        }
        return specializationMapper.toDto(specializationRepository.save(specialization));
    }

    @Override
    @Transactional
    public void deleteSpecialization(UUID id) {
        Specialization specialization = findSpecialization(id);
        specialization.setIsActive(false);
        specialization.setDeletedAt(LocalDateTime.now());
        specializationRepository.save(specialization);
    }

    private Specialization findSpecialization(UUID id) {
        return specializationRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Không tìm thấy chuyên ngành"));
    }

    private void validateReferences(UUID departmentId, UUID majorId) {
        if (!departmentRepository.existsById(departmentId)) {
            throw new ResourceNotFoundException("Không tìm thấy khoa");
        }
        Major major = majorRepository.findById(majorId)
                .orElseThrow(() -> new ResourceNotFoundException("Không tìm thấy ngành"));
        if (!departmentId.equals(major.getDepartmentId())) {
            throw new BusinessException("Ngành không thuộc khoa đã chọn");
        }
    }

    private String normalizeCode(String code) {
        if (!StringUtils.hasText(code)) {
            throw new BusinessException("Mã chuyên ngành không được để trống");
        }
        return code.trim().toUpperCase(Locale.ROOT);
    }

    private String normalizeBlank(String value) {
        return StringUtils.hasText(value) ? value.trim() : null;
    }
}

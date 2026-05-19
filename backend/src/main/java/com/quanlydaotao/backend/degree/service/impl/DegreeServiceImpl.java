package com.quanlydaotao.backend.degree.service.impl;

import com.quanlydaotao.backend.common.exception.BusinessException;
import com.quanlydaotao.backend.common.exception.ResourceNotFoundException;
import com.quanlydaotao.backend.major.repository.MajorRepository;
import com.quanlydaotao.backend.degree.dto.DegreeDto;
import com.quanlydaotao.backend.degree.entity.Degree;
import com.quanlydaotao.backend.degree.repository.DegreeRepository;
import com.quanlydaotao.backend.degree.service.DegreeService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.util.StringUtils;

import java.time.LocalDateTime;
import java.time.Year;
import java.util.List;
import java.util.Locale;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class DegreeServiceImpl implements DegreeService {
    private final DegreeRepository degreeRepository;
    private final MajorRepository majorRepository;

    @Override
    @Transactional(readOnly = true)
    public List<DegreeDto> searchDegrees(String keyword, UUID majorId, Boolean isActive) {
        return degreeRepository.search(normalizeBlank(keyword), majorId, isActive).stream().map(this::toDto).toList();
    }

    @Override
    @Transactional(readOnly = true)
    public DegreeDto getDegree(UUID id) {
        return toDto(findDegree(id));
    }

    @Override
    @Transactional
    public DegreeDto createDegree(DegreeDto request) {
        validateRequired(request);
        validateFields(request);
        String code = normalizeCode(request.getCode());
        degreeRepository.findByCode(code).ifPresent(existing -> {
            throw new BusinessException("Mã trình độ đã tồn tại");
        });

        Degree degree = new Degree();
        degree.setCode(code);
        degree.setName(request.getName().trim());
        apply(degree, request);
        degree.setIsActive(request.getIsActive() == null || request.getIsActive());
        return toDto(degreeRepository.save(degree));
    }

    @Override
    @Transactional
    public DegreeDto updateDegree(UUID id, DegreeDto request) {
        Degree degree = findDegree(id);
        validateFields(request);
        if (StringUtils.hasText(request.getCode())) {
            String code = normalizeCode(request.getCode());
            degreeRepository.findByCode(code)
                    .filter(existing -> !existing.getDegreeId().equals(id))
                    .ifPresent(existing -> {
                        throw new BusinessException("Mã trình độ đã tồn tại");
                    });
            degree.setCode(code);
        }
        if (StringUtils.hasText(request.getName())) degree.setName(request.getName().trim());
        apply(degree, request);
        return toDto(degreeRepository.save(degree));
    }

    @Override
    @Transactional
    public void deleteDegree(UUID id) {
        Degree degree = findDegree(id);
        degree.setIsActive(false);
        degree.setDeletedAt(LocalDateTime.now());
        degreeRepository.save(degree);
    }

    private Degree findDegree(UUID id) {
        return degreeRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Không tìm thấy trình độ"));
    }

    private void validateRequired(DegreeDto request) {
        if (!StringUtils.hasText(request.getCode()) || !StringUtils.hasText(request.getName())) {
            throw new BusinessException("Mã và tên trình độ không được để trống");
        }
    }

    private void validateFields(DegreeDto request) {
        if (request.getGraduationYear() != null && request.getGraduationYear() > Year.now().getValue()) {
            throw new BusinessException("Năm tốt nghiệp không được lớn hơn năm hiện tại");
        }
        if (request.getMajorId() != null && !majorRepository.existsById(request.getMajorId())) {
            throw new ResourceNotFoundException("Không tìm thấy ngành của trình độ");
        }
    }

    private void apply(Degree degree, DegreeDto request) {
        if (request.getLevel() != null) degree.setLevel(request.getLevel());
        if (request.getAcademicRank() != null) degree.setAcademicRank(request.getAcademicRank());
        if (request.getSpecialization() != null) degree.setSpecialization(request.getSpecialization());
        if (request.getInstitution() != null) degree.setInstitution(request.getInstitution());
        if (request.getGraduationYear() != null) degree.setGraduationYear(request.getGraduationYear());
        if (request.getMajorId() != null) degree.setMajorId(request.getMajorId());
        if (request.getIsActive() != null) degree.setIsActive(request.getIsActive());
    }

    private DegreeDto toDto(Degree degree) {
        return DegreeDto.builder()
                .degreeId(degree.getDegreeId())
                .code(degree.getCode())
                .name(degree.getName())
                .level(degree.getLevel())
                .academicRank(degree.getAcademicRank())
                .specialization(degree.getSpecialization())
                .institution(degree.getInstitution())
                .graduationYear(degree.getGraduationYear())
                .majorId(degree.getMajorId())
                .isActive(degree.getIsActive())
                .build();
    }

    private String normalizeCode(String code) {
        return code.trim().toUpperCase(Locale.ROOT);
    }

    private String normalizeBlank(String value) {
        return StringUtils.hasText(value) ? value.trim() : null;
    }
}

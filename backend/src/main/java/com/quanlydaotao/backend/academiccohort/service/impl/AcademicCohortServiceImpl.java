package com.quanlydaotao.backend.academiccohort.service.impl;

import com.quanlydaotao.backend.common.exception.BusinessException;
import com.quanlydaotao.backend.common.exception.ResourceNotFoundException;
import com.quanlydaotao.backend.academiccohort.dto.AcademicCohortRequest;
import com.quanlydaotao.backend.academiccohort.dto.AcademicCohortResponse;
import com.quanlydaotao.backend.academiccohort.entity.AcademicCohort;
import com.quanlydaotao.backend.academiccohort.repository.AcademicCohortRepository;
import com.quanlydaotao.backend.academiccohort.service.AcademicCohortService;
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
public class AcademicCohortServiceImpl implements AcademicCohortService {
    private final AcademicCohortRepository academicCohortRepository;

    @Override
    @Transactional(readOnly = true)
    public List<AcademicCohortResponse> searchCohorts(String keyword, Boolean isActive) {
        return academicCohortRepository.search(normalizeBlank(keyword), isActive).stream()
                .map(this::toResponse)
                .toList();
    }

    @Override
    @Transactional(readOnly = true)
    public AcademicCohortResponse getCohort(UUID id) {
        return toResponse(findCohort(id));
    }

    @Override
    @Transactional
    public AcademicCohortResponse createCohort(AcademicCohortRequest request) {
        validateRequired(request);
        validateRange(request);
        String code = normalizeCode(request.getCode());
        academicCohortRepository.findByCode(code).ifPresent(existing -> {
            throw new BusinessException("Mã niên khóa đã tồn tại");
        });

        AcademicCohort cohort = new AcademicCohort();
        cohort.setCode(code);
        cohort.setName(request.getName().trim());
        cohort.setStartYear(request.getStartYear());
        cohort.setEndYear(request.getEndYear());
        applyOptional(cohort, request);
        cohort.setIsActive(request.getIsActive() == null || request.getIsActive());
        return toResponse(academicCohortRepository.save(cohort));
    }

    @Override
    @Transactional
    public AcademicCohortResponse updateCohort(UUID id, AcademicCohortRequest request) {
        AcademicCohort cohort = findCohort(id);
        validateRange(request);
        if (StringUtils.hasText(request.getCode())) {
            String code = normalizeCode(request.getCode());
            academicCohortRepository.findByCode(code)
                    .filter(existing -> !existing.getCohortId().equals(id))
                    .ifPresent(existing -> {
                        throw new BusinessException("Mã niên khóa đã tồn tại");
                    });
            cohort.setCode(code);
        }
        if (StringUtils.hasText(request.getName())) cohort.setName(request.getName().trim());
        if (request.getStartYear() != null) cohort.setStartYear(request.getStartYear());
        if (request.getEndYear() != null) cohort.setEndYear(request.getEndYear());
        applyOptional(cohort, request);
        return toResponse(academicCohortRepository.save(cohort));
    }

    @Override
    @Transactional
    public void deleteCohort(UUID id) {
        AcademicCohort cohort = findCohort(id);
        cohort.setIsActive(false);
        cohort.setDeletedAt(LocalDateTime.now());
        academicCohortRepository.save(cohort);
    }

    private AcademicCohort findCohort(UUID id) {
        return academicCohortRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Không tìm thấy niên khóa"));
    }

    private void validateRequired(AcademicCohortRequest request) {
        if (!StringUtils.hasText(request.getCode()) || !StringUtils.hasText(request.getName())
                || request.getStartYear() == null || request.getEndYear() == null) {
            throw new BusinessException("Mã, tên, năm bắt đầu và năm kết thúc niên khóa không được để trống");
        }
    }

    private void validateRange(AcademicCohortRequest request) {
        if (request.getStartYear() != null && request.getEndYear() != null
                && request.getStartYear() >= request.getEndYear()) {
            throw new BusinessException("Năm bắt đầu niên khóa phải nhỏ hơn năm kết thúc");
        }
        if (request.getStartDate() != null && request.getEndDate() != null
                && !request.getStartDate().isBefore(request.getEndDate())) {
            throw new BusinessException("Ngày bắt đầu niên khóa phải nhỏ hơn ngày kết thúc");
        }
    }

    private void applyOptional(AcademicCohort cohort, AcademicCohortRequest request) {
        if (request.getStartDate() != null) cohort.setStartDate(request.getStartDate());
        if (request.getEndDate() != null) cohort.setEndDate(request.getEndDate());
        if (request.getDescription() != null) cohort.setDescription(request.getDescription());
        if (request.getIsActive() != null) cohort.setIsActive(request.getIsActive());
    }

    private AcademicCohortResponse toResponse(AcademicCohort cohort) {
        return AcademicCohortResponse.builder()
                .cohortId(cohort.getCohortId())
                .code(cohort.getCode())
                .name(cohort.getName())
                .startYear(cohort.getStartYear())
                .endYear(cohort.getEndYear())
                .startDate(cohort.getStartDate())
                .endDate(cohort.getEndDate())
                .description(cohort.getDescription())
                .isActive(cohort.getIsActive())
                .build();
    }

    private String normalizeCode(String code) {
        return code.trim().toUpperCase(Locale.ROOT);
    }

    private String normalizeBlank(String value) {
        return StringUtils.hasText(value) ? value.trim() : null;
    }
}

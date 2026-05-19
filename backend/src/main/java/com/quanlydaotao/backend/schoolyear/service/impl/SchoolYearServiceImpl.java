package com.quanlydaotao.backend.schoolyear.service.impl;

import com.quanlydaotao.backend.common.exception.BusinessException;
import com.quanlydaotao.backend.common.exception.ResourceNotFoundException;
import com.quanlydaotao.backend.schoolyear.dto.SchoolYearRequest;
import com.quanlydaotao.backend.schoolyear.dto.SchoolYearResponse;
import com.quanlydaotao.backend.schoolyear.entity.SchoolYear;
import com.quanlydaotao.backend.schoolyear.repository.SchoolYearRepository;
import com.quanlydaotao.backend.schoolyear.service.SchoolYearService;
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
public class SchoolYearServiceImpl implements SchoolYearService {
    private final SchoolYearRepository schoolYearRepository;

    @Override
    @Transactional(readOnly = true)
    public List<SchoolYearResponse> searchSchoolYears(String keyword, Boolean isActive) {
        return schoolYearRepository.search(normalizeBlank(keyword), isActive).stream()
                .map(this::toResponse)
                .toList();
    }

    @Override
    @Transactional(readOnly = true)
    public SchoolYearResponse getSchoolYear(UUID id) {
        return toResponse(findSchoolYear(id));
    }

    @Override
    @Transactional
    public SchoolYearResponse createSchoolYear(SchoolYearRequest request) {
        validateRequired(request);
        validateDates(request);
        String code = normalizeCode(request.getCode());
        schoolYearRepository.findByCode(code).ifPresent(existing -> {
            throw new BusinessException("Mã năm học đã tồn tại");
        });

        SchoolYear schoolYear = new SchoolYear();
        schoolYear.setCode(code);
        schoolYear.setName(resolveName(request));
        schoolYear.setStartDate(request.getStartDate());
        schoolYear.setEndDate(request.getEndDate());
        apply(schoolYear, request);
        schoolYear.setIsActive(request.getIsActive() == null || request.getIsActive());
        return toResponse(schoolYearRepository.save(schoolYear));
    }

    @Override
    @Transactional
    public SchoolYearResponse updateSchoolYear(UUID id, SchoolYearRequest request) {
        SchoolYear schoolYear = findSchoolYear(id);
        validateDates(request);
        if (StringUtils.hasText(request.getCode())) {
            String code = normalizeCode(request.getCode());
            schoolYearRepository.findByCode(code)
                    .filter(existing -> !existing.getSchoolYearId().equals(id))
                    .ifPresent(existing -> {
                        throw new BusinessException("Mã năm học đã tồn tại");
                    });
            schoolYear.setCode(code);
        }
        if (StringUtils.hasText(request.getName()) || StringUtils.hasText(request.getSchoolYearName())) {
            schoolYear.setName(resolveName(request));
        }
        if (request.getStartDate() != null) schoolYear.setStartDate(request.getStartDate());
        if (request.getEndDate() != null) schoolYear.setEndDate(request.getEndDate());
        apply(schoolYear, request);
        return toResponse(schoolYearRepository.save(schoolYear));
    }

    @Override
    @Transactional
    public void deleteSchoolYear(UUID id) {
        SchoolYear schoolYear = findSchoolYear(id);
        schoolYear.setIsActive(false);
        schoolYear.setDeletedAt(LocalDateTime.now());
        schoolYearRepository.save(schoolYear);
    }

    private SchoolYear findSchoolYear(UUID id) {
        return schoolYearRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Không tìm thấy năm học"));
    }

    private void validateRequired(SchoolYearRequest request) {
        if (!StringUtils.hasText(request.getCode()) || !StringUtils.hasText(resolveName(request))
                || request.getStartDate() == null || request.getEndDate() == null) {
            throw new BusinessException("Mã, tên, ngày bắt đầu và ngày kết thúc năm học không được để trống");
        }
    }

    private void validateDates(SchoolYearRequest request) {
        if (request.getStartDate() != null && request.getEndDate() != null
                && !request.getStartDate().isBefore(request.getEndDate())) {
            throw new BusinessException("Ngày bắt đầu năm học phải nhỏ hơn ngày kết thúc");
        }
    }

    private void apply(SchoolYear schoolYear, SchoolYearRequest request) {
        if (request.getDescription() != null) schoolYear.setDescription(request.getDescription());
        if (request.getSchoolYearName() != null) schoolYear.setSchoolYearName(request.getSchoolYearName());
        if (request.getNote() != null) schoolYear.setNote(request.getNote());
        if (request.getIsActive() != null) schoolYear.setIsActive(request.getIsActive());
    }

    private SchoolYearResponse toResponse(SchoolYear schoolYear) {
        return SchoolYearResponse.builder()
                .schoolYearId(schoolYear.getSchoolYearId())
                .code(schoolYear.getCode())
                .name(schoolYear.getName())
                .startDate(schoolYear.getStartDate())
                .endDate(schoolYear.getEndDate())
                .description(schoolYear.getDescription())
                .schoolYearName(schoolYear.getSchoolYearName())
                .note(schoolYear.getNote())
                .isActive(schoolYear.getIsActive())
                .build();
    }

    private String resolveName(SchoolYearRequest request) {
        String name = StringUtils.hasText(request.getName()) ? request.getName() : request.getSchoolYearName();
        return StringUtils.hasText(name) ? name.trim() : null;
    }

    private String normalizeCode(String code) {
        return code.trim().toUpperCase(Locale.ROOT);
    }

    private String normalizeBlank(String value) {
        return StringUtils.hasText(value) ? value.trim() : null;
    }
}

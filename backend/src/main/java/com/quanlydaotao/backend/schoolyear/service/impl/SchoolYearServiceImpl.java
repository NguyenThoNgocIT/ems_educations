package com.quanlydaotao.backend.schoolyear.service.impl;

import com.quanlydaotao.backend.common.exception.BusinessException;
import com.quanlydaotao.backend.common.exception.ResourceNotFoundException;
import com.quanlydaotao.backend.schoolyear.dto.SchoolYearRequest;
import com.quanlydaotao.backend.schoolyear.dto.SchoolYearResponse;
import com.quanlydaotao.backend.schoolyear.entity.SchoolYear;
import com.quanlydaotao.backend.schoolyear.mapper.SchoolYearMapper;
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
    private final SchoolYearMapper schoolYearMapper;

    @Override
    @Transactional(readOnly = true)
    public List<SchoolYearResponse> searchSchoolYears(String keyword, Boolean isActive) {
        return schoolYearMapper.toDtoList(schoolYearRepository.search(normalizeBlank(keyword), isActive));
    }

    @Override
    @Transactional(readOnly = true)
    public SchoolYearResponse getSchoolYear(UUID id) {
        return schoolYearMapper.toDto(findSchoolYear(id));
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

        SchoolYear schoolYear = schoolYearMapper.toEntity(request);
        schoolYear.setCode(code);
        schoolYear.setName(resolveName(request));
        schoolYear.setIsActive(request.getIsActive() == null || request.getIsActive());
        return schoolYearMapper.toDto(schoolYearRepository.save(schoolYear));
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
        schoolYearMapper.updateEntityFromDto(request, schoolYear);
        if (StringUtils.hasText(request.getCode())) schoolYear.setCode(normalizeCode(request.getCode()));
        if (StringUtils.hasText(request.getName()) || StringUtils.hasText(request.getSchoolYearName())) {
            schoolYear.setName(resolveName(request));
        }
        return schoolYearMapper.toDto(schoolYearRepository.save(schoolYear));
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

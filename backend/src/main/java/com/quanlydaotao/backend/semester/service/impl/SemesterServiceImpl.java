package com.quanlydaotao.backend.semester.service.impl;

import com.quanlydaotao.backend.common.exception.BusinessException;
import com.quanlydaotao.backend.common.exception.ResourceNotFoundException;
import com.quanlydaotao.backend.semester.dto.SemesterRequest;
import com.quanlydaotao.backend.semester.dto.SemesterResponse;
import com.quanlydaotao.backend.schoolyear.entity.SchoolYear;
import com.quanlydaotao.backend.semester.entity.Semester;
import com.quanlydaotao.backend.schoolyear.repository.SchoolYearRepository;
import com.quanlydaotao.backend.semester.mapper.SemesterMapper;
import com.quanlydaotao.backend.semester.repository.SemesterRepository;
import com.quanlydaotao.backend.semester.service.SemesterService;
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
public class SemesterServiceImpl implements SemesterService {
    private final SemesterRepository semesterRepository;
    private final SchoolYearRepository schoolYearRepository;
    private final SemesterMapper semesterMapper;

    @Override
    @Transactional(readOnly = true)
    public List<SemesterResponse> searchSemesters(String keyword, UUID schoolYearId, Boolean status, Boolean isActive) {
        return semesterRepository.search(normalizeBlank(keyword), schoolYearId, status, isActive).stream()
                .map(semesterMapper::toDto)
                .toList();
    }

    @Override
    @Transactional(readOnly = true)
    public SemesterResponse getSemester(UUID id) {
        return semesterMapper.toDto(findSemester(id));
    }

    @Override
    @Transactional
    public SemesterResponse createSemester(SemesterRequest request) {
        validateRequired(request);
        SchoolYear schoolYear = findSchoolYear(request.getSchoolYearId());
        validateSemesterDates(request, schoolYear);
        String code = normalizeCode(request.getCode());
        semesterRepository.findBySchoolYearIdAndCode(request.getSchoolYearId(), code).ifPresent(existing -> {
            throw new BusinessException("Mã học kỳ đã tồn tại trong năm học");
        });

        Semester semester = semesterMapper.toEntity(request);
        semester.setCode(code);
        semester.setName(request.getName().trim());
        semester.setIsActive(request.getIsActive() == null || request.getIsActive());
        return semesterMapper.toDto(semesterRepository.save(semester));
    }

    @Override
    @Transactional
    public SemesterResponse updateSemester(UUID id, SemesterRequest request) {
        Semester semester = findSemester(id);
        UUID schoolYearId = request.getSchoolYearId() == null ? semester.getSchoolYearId() : request.getSchoolYearId();
        SchoolYear schoolYear = findSchoolYear(schoolYearId);
        validateSemesterDates(request, schoolYear);
        if (StringUtils.hasText(request.getCode())) {
            String code = normalizeCode(request.getCode());
            semesterRepository.findBySchoolYearIdAndCode(schoolYearId, code)
                    .filter(existing -> !existing.getSemesterId().equals(id))
                    .ifPresent(existing -> {
                        throw new BusinessException("Mã học kỳ đã tồn tại trong năm học");
                    });
            semester.setCode(code);
        }
        semesterMapper.updateEntityFromDto(request, semester);
        if (StringUtils.hasText(request.getCode())) semester.setCode(normalizeCode(request.getCode()));
        if (StringUtils.hasText(request.getName())) semester.setName(request.getName().trim());
        return semesterMapper.toDto(semesterRepository.save(semester));
    }

    @Override
    @Transactional
    public void deleteSemester(UUID id) {
        Semester semester = findSemester(id);
        semester.setIsActive(false);
        semester.setDeletedAt(LocalDateTime.now());
        semesterRepository.save(semester);
    }

    private Semester findSemester(UUID id) {
        return semesterRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Không tìm thấy học kỳ"));
    }

    private SchoolYear findSchoolYear(UUID id) {
        return schoolYearRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Không tìm thấy năm học"));
    }

    private void validateRequired(SemesterRequest request) {
        if (!StringUtils.hasText(request.getCode()) || !StringUtils.hasText(request.getName())
                || request.getSchoolYearId() == null || request.getStartDate() == null || request.getEndDate() == null) {
            throw new BusinessException("Mã, tên, năm học, ngày bắt đầu và ngày kết thúc học kỳ không được để trống");
        }
    }

    private void validateSemesterDates(SemesterRequest request, SchoolYear schoolYear) {
        if (request.getStartDate() != null && request.getEndDate() != null
                && !request.getStartDate().isBefore(request.getEndDate())) {
            throw new BusinessException("Ngày bắt đầu học kỳ phải nhỏ hơn ngày kết thúc");
        }
        if (request.getStartDate() != null && (request.getStartDate().isBefore(schoolYear.getStartDate())
                || request.getStartDate().isAfter(schoolYear.getEndDate()))) {
            throw new BusinessException("Ngày bắt đầu học kỳ phải nằm trong năm học");
        }
        if (request.getEndDate() != null && (request.getEndDate().isBefore(schoolYear.getStartDate())
                || request.getEndDate().isAfter(schoolYear.getEndDate()))) {
            throw new BusinessException("Ngày kết thúc học kỳ phải nằm trong năm học");
        }
    }

    private String normalizeCode(String code) {
        return code.trim().toUpperCase(Locale.ROOT);
    }

    private String normalizeBlank(String value) {
        return StringUtils.hasText(value) ? value.trim() : null;
    }
}

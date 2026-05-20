package com.quanlydaotao.backend.administrativeclass.service.impl;

import com.quanlydaotao.backend.common.exception.BusinessException;
import com.quanlydaotao.backend.common.exception.ResourceNotFoundException;
import com.quanlydaotao.backend.administrativeclass.dto.AdministrativeClassRequest;
import com.quanlydaotao.backend.administrativeclass.dto.AdministrativeClassResponse;
import com.quanlydaotao.backend.administrativeclass.entity.AdministrativeClass;
import com.quanlydaotao.backend.academiccohort.repository.AcademicCohortRepository;
import com.quanlydaotao.backend.administrativeclass.mapper.AdministrativeClassMapper;
import com.quanlydaotao.backend.administrativeclass.repository.AdministrativeClassRepository;
import com.quanlydaotao.backend.administrativeclass.service.AdministrativeClassService;
import com.quanlydaotao.backend.department.repository.DepartmentRepository;
import com.quanlydaotao.backend.instructor.repository.InstructorProfileRepository;
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
public class AdministrativeClassServiceImpl implements AdministrativeClassService {
    private final AdministrativeClassRepository administrativeClassRepository;
    private final DepartmentRepository departmentRepository;
    private final AcademicCohortRepository academicCohortRepository;
    private final InstructorProfileRepository instructorProfileRepository;
    private final AdministrativeClassMapper administrativeClassMapper;

    @Override
    @Transactional(readOnly = true)
    public List<AdministrativeClassResponse> searchClasses(String keyword, UUID departmentId, UUID academicCohortId, Boolean isActive) {
        return administrativeClassRepository.search(normalizeBlank(keyword), departmentId, academicCohortId, isActive).stream()
                .map(administrativeClassMapper::toDto)
                .toList();
    }

    @Override
    @Transactional(readOnly = true)
    public AdministrativeClassResponse getClass(UUID id) {
        return administrativeClassMapper.toDto(findClass(id));
    }

    @Override
    @Transactional
    public AdministrativeClassResponse createClass(AdministrativeClassRequest request) {
        validateRequired(request);
        String classCode = normalizeCode(request.getClassCode());
        administrativeClassRepository.findByClassCode(classCode).ifPresent(existing -> {
            throw new BusinessException("Mã lớp hành chính đã tồn tại");
        });
        validateReferences(request, null);

        AdministrativeClass administrativeClass = administrativeClassMapper.toEntity(request);
        administrativeClass.setClassCode(classCode);
        administrativeClass.setClassName(request.getClassName().trim());
        administrativeClass.setIsActive(request.getIsActive() == null || request.getIsActive());
        return administrativeClassMapper.toDto(administrativeClassRepository.save(administrativeClass));
    }

    @Override
    @Transactional
    public AdministrativeClassResponse updateClass(UUID id, AdministrativeClassRequest request) {
        AdministrativeClass administrativeClass = findClass(id);
        validateReferences(request, id);
        if (StringUtils.hasText(request.getClassCode())) {
            String classCode = normalizeCode(request.getClassCode());
            administrativeClassRepository.findByClassCode(classCode)
                    .filter(existing -> !existing.getClassId().equals(id))
                    .ifPresent(existing -> {
                        throw new BusinessException("Mã lớp hành chính đã tồn tại");
                    });
            administrativeClass.setClassCode(classCode);
        }
        administrativeClassMapper.updateEntityFromDto(request, administrativeClass);
        if (StringUtils.hasText(request.getClassCode())) administrativeClass.setClassCode(normalizeCode(request.getClassCode()));
        if (StringUtils.hasText(request.getClassName())) administrativeClass.setClassName(request.getClassName().trim());
        return administrativeClassMapper.toDto(administrativeClassRepository.save(administrativeClass));
    }

    @Override
    @Transactional
    public void deleteClass(UUID id) {
        AdministrativeClass administrativeClass = findClass(id);
        administrativeClass.setIsActive(false);
        administrativeClass.setDeletedAt(LocalDateTime.now());
        administrativeClassRepository.save(administrativeClass);
    }

    private AdministrativeClass findClass(UUID id) {
        return administrativeClassRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Không tìm thấy lớp hành chính"));
    }

    private void validateRequired(AdministrativeClassRequest request) {
        if (!StringUtils.hasText(request.getClassCode()) || !StringUtils.hasText(request.getClassName())
                || request.getDepartmentId() == null || request.getAcademicCohortId() == null) {
            throw new BusinessException("Mã lớp, tên lớp, khoa và niên khóa không được để trống");
        }
    }

    private void validateReferences(AdministrativeClassRequest request, UUID currentClassId) {
        if (request.getDepartmentId() != null && !departmentRepository.existsById(request.getDepartmentId())) {
            throw new ResourceNotFoundException("Không tìm thấy khoa của lớp hành chính");
        }
        if (request.getAcademicCohortId() != null && !academicCohortRepository.existsById(request.getAcademicCohortId())) {
            throw new ResourceNotFoundException("Không tìm thấy niên khóa của lớp hành chính");
        }
        if (request.getAdvisorId() != null && !instructorProfileRepository.existsById(request.getAdvisorId())) {
            throw new ResourceNotFoundException("Không tìm thấy cố vấn học tập");
        }
        if (request.getAdvisorId() != null) {
            administrativeClassRepository.findByAdvisorIdAndIsActiveTrue(request.getAdvisorId())
                    .filter(existing -> currentClassId == null || !existing.getClassId().equals(currentClassId))
                    .ifPresent(existing -> {
                        throw new BusinessException("Giáo viên cố vấn đã được gán cho lớp hành chính khác");
                    });
        }
        if (request.getMaxSize() != null && request.getMaxSize() <= 0) {
            throw new BusinessException("Sĩ số tối đa của lớp hành chính phải lớn hơn 0");
        }
    }

    private String normalizeCode(String code) {
        return code.trim().toUpperCase(Locale.ROOT);
    }

    private String normalizeBlank(String value) {
        return StringUtils.hasText(value) ? value.trim() : null;
    }
}

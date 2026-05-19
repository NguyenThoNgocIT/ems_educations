package com.quanlydaotao.backend.administrativeclass.service.impl;

import com.quanlydaotao.backend.common.exception.BusinessException;
import com.quanlydaotao.backend.common.exception.ResourceNotFoundException;
import com.quanlydaotao.backend.administrativeclass.dto.AdministrativeClassRequest;
import com.quanlydaotao.backend.administrativeclass.dto.AdministrativeClassResponse;
import com.quanlydaotao.backend.administrativeclass.entity.AdministrativeClass;
import com.quanlydaotao.backend.academiccohort.repository.AcademicCohortRepository;
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

    @Override
    @Transactional(readOnly = true)
    public List<AdministrativeClassResponse> searchClasses(String keyword, UUID departmentId, UUID academicCohortId, Boolean isActive) {
        return administrativeClassRepository.search(normalizeBlank(keyword), departmentId, academicCohortId, isActive).stream()
                .map(this::toResponse)
                .toList();
    }

    @Override
    @Transactional(readOnly = true)
    public AdministrativeClassResponse getClass(UUID id) {
        return toResponse(findClass(id));
    }

    @Override
    @Transactional
    public AdministrativeClassResponse createClass(AdministrativeClassRequest request) {
        validateRequired(request);
        String classCode = normalizeCode(request.getClassCode());
        administrativeClassRepository.findByClassCode(classCode).ifPresent(existing -> {
            throw new BusinessException("Mã lớp hành chính đã tồn tại");
        });
        validateReferences(request);

        AdministrativeClass administrativeClass = new AdministrativeClass();
        administrativeClass.setClassCode(classCode);
        administrativeClass.setClassName(request.getClassName().trim());
        administrativeClass.setDepartmentId(request.getDepartmentId());
        administrativeClass.setAcademicCohortId(request.getAcademicCohortId());
        apply(administrativeClass, request);
        administrativeClass.setIsActive(request.getIsActive() == null || request.getIsActive());
        return toResponse(administrativeClassRepository.save(administrativeClass));
    }

    @Override
    @Transactional
    public AdministrativeClassResponse updateClass(UUID id, AdministrativeClassRequest request) {
        AdministrativeClass administrativeClass = findClass(id);
        validateReferences(request);
        if (StringUtils.hasText(request.getClassCode())) {
            String classCode = normalizeCode(request.getClassCode());
            administrativeClassRepository.findByClassCode(classCode)
                    .filter(existing -> !existing.getClassId().equals(id))
                    .ifPresent(existing -> {
                        throw new BusinessException("Mã lớp hành chính đã tồn tại");
                    });
            administrativeClass.setClassCode(classCode);
        }
        if (StringUtils.hasText(request.getClassName())) administrativeClass.setClassName(request.getClassName().trim());
        if (request.getDepartmentId() != null) administrativeClass.setDepartmentId(request.getDepartmentId());
        if (request.getAcademicCohortId() != null) administrativeClass.setAcademicCohortId(request.getAcademicCohortId());
        apply(administrativeClass, request);
        return toResponse(administrativeClassRepository.save(administrativeClass));
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

    private void validateReferences(AdministrativeClassRequest request) {
        if (request.getDepartmentId() != null && !departmentRepository.existsById(request.getDepartmentId())) {
            throw new ResourceNotFoundException("Không tìm thấy khoa của lớp hành chính");
        }
        if (request.getAcademicCohortId() != null && !academicCohortRepository.existsById(request.getAcademicCohortId())) {
            throw new ResourceNotFoundException("Không tìm thấy niên khóa của lớp hành chính");
        }
        if (request.getAdvisorId() != null && !instructorProfileRepository.existsById(request.getAdvisorId())) {
            throw new ResourceNotFoundException("Không tìm thấy cố vấn học tập");
        }
        if (request.getMaxSize() != null && request.getMaxSize() <= 0) {
            throw new BusinessException("Sĩ số tối đa của lớp hành chính phải lớn hơn 0");
        }
    }

    private void apply(AdministrativeClass administrativeClass, AdministrativeClassRequest request) {
        if (request.getAdvisorId() != null) administrativeClass.setAdvisorId(request.getAdvisorId());
        if (request.getMaxSize() != null) administrativeClass.setMaxSize(request.getMaxSize());
        if (request.getStatus() != null) administrativeClass.setStatus(request.getStatus());
        if (request.getNote() != null) administrativeClass.setNote(request.getNote());
        if (request.getIsActive() != null) administrativeClass.setIsActive(request.getIsActive());
    }

    private AdministrativeClassResponse toResponse(AdministrativeClass administrativeClass) {
        return AdministrativeClassResponse.builder()
                .classId(administrativeClass.getClassId())
                .classCode(administrativeClass.getClassCode())
                .className(administrativeClass.getClassName())
                .departmentId(administrativeClass.getDepartmentId())
                .advisorId(administrativeClass.getAdvisorId())
                .academicCohortId(administrativeClass.getAcademicCohortId())
                .maxSize(administrativeClass.getMaxSize())
                .status(administrativeClass.getStatus())
                .note(administrativeClass.getNote())
                .isActive(administrativeClass.getIsActive())
                .build();
    }

    private String normalizeCode(String code) {
        return code.trim().toUpperCase(Locale.ROOT);
    }

    private String normalizeBlank(String value) {
        return StringUtils.hasText(value) ? value.trim() : null;
    }
}

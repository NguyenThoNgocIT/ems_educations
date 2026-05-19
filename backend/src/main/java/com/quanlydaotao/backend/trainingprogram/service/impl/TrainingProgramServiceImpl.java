package com.quanlydaotao.backend.trainingprogram.service.impl;

import com.quanlydaotao.backend.common.exception.BusinessException;
import com.quanlydaotao.backend.common.exception.ResourceNotFoundException;
import com.quanlydaotao.backend.trainingprogram.dto.TrainingProgramRequest;
import com.quanlydaotao.backend.trainingprogram.dto.TrainingProgramResponse;
import com.quanlydaotao.backend.major.entity.Major;
import com.quanlydaotao.backend.trainingprogram.entity.TrainingProgram;
import com.quanlydaotao.backend.academiccohort.repository.AcademicCohortRepository;
import com.quanlydaotao.backend.major.repository.MajorRepository;
import com.quanlydaotao.backend.trainingprogram.repository.TrainingProgramRepository;
import com.quanlydaotao.backend.trainingprogram.service.TrainingProgramService;
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
public class TrainingProgramServiceImpl implements TrainingProgramService {
    private final TrainingProgramRepository trainingProgramRepository;
    private final MajorRepository majorRepository;
    private final DepartmentRepository departmentRepository;
    private final AcademicCohortRepository academicCohortRepository;

    @Override
    @Transactional(readOnly = true)
    public List<TrainingProgramResponse> getAllPrograms(String keyword, UUID majorId, UUID departmentId,
                                                   UUID academicCohortId, Boolean isActive) {
        return trainingProgramRepository.search(normalizeBlank(keyword), majorId, departmentId, academicCohortId, isActive)
                .stream()
                .map(this::mapToDto)
                .toList();
    }

    @Override
    @Transactional(readOnly = true)
    public TrainingProgramResponse getProgramById(UUID id) {
        return mapToDto(findProgram(id));
    }

    @Override
    @Transactional
    public TrainingProgramResponse createProgram(TrainingProgramRequest request) {
        String code = resolveCode(request);
        String name = resolveName(request);
        validateRequired(code, name, request);
        validateDateRange(request);
        trainingProgramRepository.findByCode(code).ifPresent(existing -> {
            throw new BusinessException("Mã chương trình đào tạo đã tồn tại");
        });

        Major major = validateMajorAndDepartment(request.getMajorId(), request.getDepartmentId());
        validateCohort(request.getAcademicCohortId());

        TrainingProgram program = new TrainingProgram();
        program.setCode(code);
        program.setName(name);
        program.setMajorId(major.getMajorId());
        program.setDepartmentId(request.getDepartmentId());
        program.setAcademicCohortId(request.getAcademicCohortId());
        apply(program, request);
        program.setIsActive(request.getIsActive() == null || request.getIsActive());
        return mapToDto(trainingProgramRepository.save(program));
    }

    @Override
    @Transactional
    public TrainingProgramResponse updateProgram(UUID id, TrainingProgramRequest request) {
        TrainingProgram program = findProgram(id);
        validateDateRange(request);
        if (StringUtils.hasText(request.getCode()) || StringUtils.hasText(request.getProgramCode())) {
            String code = resolveCode(request);
            trainingProgramRepository.findByCode(code)
                    .filter(existing -> !existing.getTrainingProgramId().equals(id))
                    .ifPresent(existing -> {
                        throw new BusinessException("Mã chương trình đào tạo đã tồn tại");
                    });
            program.setCode(code);
        }
        if (StringUtils.hasText(request.getName()) || StringUtils.hasText(request.getProgramName())) {
            program.setName(resolveName(request));
        }
        UUID majorId = request.getMajorId() == null ? program.getMajorId() : request.getMajorId();
        UUID departmentId = request.getDepartmentId() == null ? program.getDepartmentId() : request.getDepartmentId();
        if (request.getMajorId() != null || request.getDepartmentId() != null) {
            Major major = validateMajorAndDepartment(majorId, departmentId);
            program.setMajorId(major.getMajorId());
            program.setDepartmentId(departmentId);
        }
        if (request.getAcademicCohortId() != null) {
            validateCohort(request.getAcademicCohortId());
            program.setAcademicCohortId(request.getAcademicCohortId());
        }
        apply(program, request);
        return mapToDto(trainingProgramRepository.save(program));
    }

    @Override
    @Transactional
    public void deleteProgram(UUID id) {
        TrainingProgram program = findProgram(id);
        program.setIsActive(false);
        program.setDeletedAt(LocalDateTime.now());
        trainingProgramRepository.save(program);
    }

    @Override
    @Transactional(readOnly = true)
    public List<TrainingProgramResponse> getAllTrainingProgramsList() {
        return getAllPrograms(null, null, null, null, true);
    }

    private TrainingProgram findProgram(UUID id) {
        return trainingProgramRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Không tìm thấy chương trình đào tạo"));
    }

    private void validateRequired(String code, String name, TrainingProgramRequest request) {
        if (!StringUtils.hasText(code) || !StringUtils.hasText(name) || request.getMajorId() == null
                || request.getDepartmentId() == null || request.getAcademicCohortId() == null) {
            throw new BusinessException("Mã, tên, ngành, khoa và niên khóa của chương trình đào tạo không được để trống");
        }
    }

    private Major validateMajorAndDepartment(UUID majorId, UUID departmentId) {
        Major major = majorRepository.findById(majorId)
                .orElseThrow(() -> new ResourceNotFoundException("Không tìm thấy ngành của chương trình đào tạo"));
        if (!departmentRepository.existsById(departmentId)) {
            throw new ResourceNotFoundException("Không tìm thấy khoa của chương trình đào tạo");
        }
        if (major.getDepartmentId() != null && !major.getDepartmentId().equals(departmentId)) {
            throw new BusinessException("Ngành không thuộc khoa đã chọn");
        }
        return major;
    }

    private void validateCohort(UUID academicCohortId) {
        if (!academicCohortRepository.existsById(academicCohortId)) {
            throw new ResourceNotFoundException("Không tìm thấy niên khóa của chương trình đào tạo");
        }
    }

    private void validateDateRange(TrainingProgramRequest request) {
        if (request.getEffectiveDate() != null && request.getExpiryDate() != null
                && request.getEffectiveDate().isAfter(request.getExpiryDate())) {
            throw new BusinessException("Ngày hiệu lực chương trình đào tạo phải nhỏ hơn hoặc bằng ngày hết hiệu lực");
        }
        if (request.getDurationYears() != null && request.getMaxDurationYears() != null
                && request.getDurationYears().compareTo(request.getMaxDurationYears()) > 0) {
            throw new BusinessException("Thời gian đào tạo chuẩn không được lớn hơn thời gian đào tạo tối đa");
        }
    }

    private void apply(TrainingProgram program, TrainingProgramRequest request) {
        if (request.getNameEn() != null) program.setNameEn(request.getNameEn());
        if (request.getDegreeLevel() != null) program.setDegreeLevel(request.getDegreeLevel());
        if (request.getEducationType() != null) program.setEducationType(request.getEducationType());
        if (request.getTotalCredits() != null) program.setTotalCredits(request.getTotalCredits());
        if (request.getRequiredCredits() != null) program.setRequiredCredits(request.getRequiredCredits());
        if (request.getElectiveCredits() != null) program.setElectiveCredits(request.getElectiveCredits());
        if (request.getInternshipCredits() != null) program.setInternshipCredits(request.getInternshipCredits());
        if (request.getThesisCredits() != null) program.setThesisCredits(request.getThesisCredits());
        if (request.getAdmissionYear() != null) program.setAdmissionYear(request.getAdmissionYear());
        if (request.getDurationYears() != null) program.setDurationYears(request.getDurationYears());
        if (request.getMaxDurationYears() != null) program.setMaxDurationYears(request.getMaxDurationYears());
        if (request.getEffectiveDate() != null) program.setEffectiveDate(request.getEffectiveDate());
        if (request.getExpiryDate() != null) program.setExpiryDate(request.getExpiryDate());
        if (request.getDescription() != null) program.setDescription(request.getDescription());
        if (request.getObjectives() != null) program.setObjectives(request.getObjectives());
        if (request.getLearningOutcomes() != null) program.setLearningOutcomes(request.getLearningOutcomes());
        if (request.getVersion() != null) program.setVersion(request.getVersion());
        if (request.getStatus() != null) program.setStatus(request.getStatus());
        if (request.getIsActive() != null) program.setIsActive(request.getIsActive());
    }

    private TrainingProgramResponse mapToDto(TrainingProgram entity) {
        TrainingProgramResponse dto = new TrainingProgramResponse();
        dto.setTrainingProgramId(entity.getTrainingProgramId());
        dto.setCode(entity.getCode());
        dto.setName(entity.getName());
        dto.setNameEn(entity.getNameEn());
        dto.setMajorId(entity.getMajorId());
        dto.setDepartmentId(entity.getDepartmentId());
        dto.setAcademicCohortId(entity.getAcademicCohortId());
        dto.setDegreeLevel(entity.getDegreeLevel());
        dto.setEducationType(entity.getEducationType());
        dto.setTotalCredits(entity.getTotalCredits());
        dto.setRequiredCredits(entity.getRequiredCredits());
        dto.setElectiveCredits(entity.getElectiveCredits());
        dto.setInternshipCredits(entity.getInternshipCredits());
        dto.setThesisCredits(entity.getThesisCredits());
        dto.setAdmissionYear(entity.getAdmissionYear());
        dto.setDurationYears(entity.getDurationYears());
        dto.setMaxDurationYears(entity.getMaxDurationYears());
        dto.setEffectiveDate(entity.getEffectiveDate());
        dto.setExpiryDate(entity.getExpiryDate());
        dto.setDescription(entity.getDescription());
        dto.setObjectives(entity.getObjectives());
        dto.setLearningOutcomes(entity.getLearningOutcomes());
        dto.setVersion(entity.getVersion());
        dto.setStatus(entity.getStatus());
        dto.setIsActive(entity.getIsActive());
        return dto;
    }

    private String resolveCode(TrainingProgramRequest request) {
        String code = StringUtils.hasText(request.getCode()) ? request.getCode() : request.getProgramCode();
        return StringUtils.hasText(code) ? code.trim().toUpperCase(Locale.ROOT) : null;
    }

    private String resolveName(TrainingProgramRequest request) {
        String name = StringUtils.hasText(request.getName()) ? request.getName() : request.getProgramName();
        return StringUtils.hasText(name) ? name.trim() : null;
    }

    private String normalizeBlank(String value) {
        return StringUtils.hasText(value) ? value.trim() : null;
    }
}

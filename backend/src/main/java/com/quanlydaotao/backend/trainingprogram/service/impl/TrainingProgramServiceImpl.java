package com.quanlydaotao.backend.trainingprogram.service.impl;

import com.quanlydaotao.backend.common.exception.BusinessException;
import com.quanlydaotao.backend.common.exception.ResourceNotFoundException;
import com.quanlydaotao.backend.trainingprogram.dto.TrainingProgramRequest;
import com.quanlydaotao.backend.trainingprogram.dto.TrainingProgramResponse;
import com.quanlydaotao.backend.major.entity.Major;
import com.quanlydaotao.backend.trainingprogram.entity.TrainingProgram;
import com.quanlydaotao.backend.academiccohort.repository.AcademicCohortRepository;
import com.quanlydaotao.backend.major.repository.MajorRepository;
import com.quanlydaotao.backend.specialization.entity.Specialization;
import com.quanlydaotao.backend.specialization.repository.SpecializationRepository;
import com.quanlydaotao.backend.trainingprogram.mapper.TrainingProgramMapper;
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
    private final SpecializationRepository specializationRepository;
    private final DepartmentRepository departmentRepository;
    private final AcademicCohortRepository academicCohortRepository;
    private final TrainingProgramMapper trainingProgramMapper;

    @Override
    @Transactional(readOnly = true)
    public List<TrainingProgramResponse> getAllPrograms(String keyword, UUID majorId, UUID specializationId, UUID departmentId,
                                                   UUID academicCohortId, String programPhase, Boolean isActive) {
        return trainingProgramRepository.search(normalizeBlank(keyword), majorId, specializationId, departmentId,
                        academicCohortId, normalizePhase(programPhase), isActive)
                .stream()
                .map(trainingProgramMapper::toDto)
                .toList();
    }

    @Override
    @Transactional(readOnly = true)
    public TrainingProgramResponse getProgramById(UUID id) {
        return trainingProgramMapper.toDto(findProgram(id));
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

        validateAcademicScope(request.getDepartmentId(), request.getMajorId(), request.getSpecializationId(), resolveProgramPhase(request.getProgramPhase()));
        validateCohort(request.getAcademicCohortId());

        TrainingProgram program = trainingProgramMapper.toEntity(request);
        program.setCode(code);
        program.setName(name);
        program.setMajorId(request.getMajorId());
        program.setSpecializationId(request.getSpecializationId());
        program.setDepartmentId(request.getDepartmentId());
        program.setAcademicCohortId(request.getAcademicCohortId());
        program.setProgramPhase(resolveProgramPhase(request.getProgramPhase()));
        program.setIsActive(request.getIsActive() == null || request.getIsActive());
        return trainingProgramMapper.toDto(trainingProgramRepository.save(program));
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
        UUID specializationId = request.getSpecializationId() == null ? program.getSpecializationId() : request.getSpecializationId();
        UUID departmentId = request.getDepartmentId() == null ? program.getDepartmentId() : request.getDepartmentId();
        String programPhase = request.getProgramPhase() == null ? program.getProgramPhase() : resolveProgramPhase(request.getProgramPhase());
        if (request.getMajorId() != null || request.getSpecializationId() != null || request.getDepartmentId() != null || request.getProgramPhase() != null) {
            validateAcademicScope(departmentId, majorId, specializationId, programPhase);
            program.setMajorId(majorId);
            program.setSpecializationId(specializationId);
            program.setDepartmentId(departmentId);
            program.setProgramPhase(programPhase);
        }
        if (request.getAcademicCohortId() != null) {
            validateCohort(request.getAcademicCohortId());
            program.setAcademicCohortId(request.getAcademicCohortId());
        }
        trainingProgramMapper.updateEntityFromDto(request, program);
        if (StringUtils.hasText(request.getCode()) || StringUtils.hasText(request.getProgramCode())) {
            program.setCode(resolveCode(request));
        }
        if (StringUtils.hasText(request.getName()) || StringUtils.hasText(request.getProgramName())) {
            program.setName(resolveName(request));
        }
        return trainingProgramMapper.toDto(trainingProgramRepository.save(program));
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
        return getAllPrograms(null, null, null, null, null, null, true);
    }

    private TrainingProgram findProgram(UUID id) {
        return trainingProgramRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Không tìm thấy chương trình đào tạo"));
    }

    private void validateRequired(String code, String name, TrainingProgramRequest request) {
        if (!StringUtils.hasText(code) || !StringUtils.hasText(name)
                || request.getDepartmentId() == null || request.getAcademicCohortId() == null) {
            throw new BusinessException("Mã, tên, khoa và niên khóa của chương trình đào tạo không được để trống");
        }
    }

    private void validateAcademicScope(UUID departmentId, UUID majorId, UUID specializationId, String programPhase) {
        if (!departmentRepository.existsById(departmentId)) {
            throw new ResourceNotFoundException("Không tìm thấy khoa của chương trình đào tạo");
        }
        if (majorId != null) {
            Major major = majorRepository.findById(majorId)
                    .orElseThrow(() -> new ResourceNotFoundException("Không tìm thấy ngành của chương trình đào tạo"));
            if (major.getDepartmentId() != null && !major.getDepartmentId().equals(departmentId)) {
                throw new BusinessException("Ngành không thuộc khoa đã chọn");
            }
        }
        if (specializationId != null) {
            if (majorId == null) {
                throw new BusinessException("Chuyên ngành phải thuộc một ngành cụ thể");
            }
            Specialization specialization = specializationRepository.findById(specializationId)
                    .orElseThrow(() -> new ResourceNotFoundException("Không tìm thấy chuyên ngành"));
            if (!departmentId.equals(specialization.getDepartmentId()) || !majorId.equals(specialization.getMajorId())) {
                throw new BusinessException("Chuyên ngành không thuộc khoa/ngành đã chọn");
            }
        }
        if ("SPECIALIZATION".equals(programPhase) && (majorId == null || specializationId == null)) {
            throw new BusinessException("Chương trình chuyên ngành phải chọn ngành và chuyên ngành");
        }
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

    private String resolveProgramPhase(String value) {
        String phase = normalizePhase(value);
        return phase == null ? "FOUNDATION" : phase;
    }

    private String normalizePhase(String value) {
        return StringUtils.hasText(value) ? value.trim().toUpperCase(Locale.ROOT) : null;
    }
}

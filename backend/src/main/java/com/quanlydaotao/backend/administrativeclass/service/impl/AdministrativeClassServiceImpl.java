package com.quanlydaotao.backend.administrativeclass.service.impl;

import com.quanlydaotao.backend.common.exception.BusinessException;
import com.quanlydaotao.backend.common.exception.ResourceNotFoundException;
import com.quanlydaotao.backend.administrativeclass.dto.AdministrativeClassRequest;
import com.quanlydaotao.backend.administrativeclass.dto.AdministrativeClassResponse;
import com.quanlydaotao.backend.administrativeclass.entity.AdministrativeClass;
import com.quanlydaotao.backend.academiccohort.entity.AcademicCohort;
import com.quanlydaotao.backend.academiccohort.repository.AcademicCohortRepository;
import com.quanlydaotao.backend.administrativeclass.mapper.AdministrativeClassMapper;
import com.quanlydaotao.backend.administrativeclass.repository.AdministrativeClassRepository;
import com.quanlydaotao.backend.administrativeclass.service.AdministrativeClassService;
import com.quanlydaotao.backend.department.entity.Department;
import com.quanlydaotao.backend.department.repository.DepartmentRepository;
import com.quanlydaotao.backend.instructor.entity.InstructorProfile;
import com.quanlydaotao.backend.instructor.repository.InstructorProfileRepository;
import com.quanlydaotao.backend.major.entity.Major;
import com.quanlydaotao.backend.major.repository.MajorRepository;
import com.quanlydaotao.backend.specialization.entity.Specialization;
import com.quanlydaotao.backend.specialization.repository.SpecializationRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.util.StringUtils;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Locale;
import java.util.Map;
import java.util.Objects;
import java.util.Set;
import java.util.UUID;
import java.util.function.Function;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class AdministrativeClassServiceImpl implements AdministrativeClassService {
    private final AdministrativeClassRepository administrativeClassRepository;
    private final DepartmentRepository departmentRepository;
    private final AcademicCohortRepository academicCohortRepository;
    private final InstructorProfileRepository instructorProfileRepository;
    private final MajorRepository majorRepository;
    private final SpecializationRepository specializationRepository;
    private final AdministrativeClassMapper administrativeClassMapper;

    @Override
    @Transactional(readOnly = true)
    public List<AdministrativeClassResponse> searchClasses(String keyword, UUID departmentId, UUID majorId, UUID specializationId,
                                                           UUID academicCohortId, String classPhase, Boolean isActive) {
        List<AdministrativeClass> classes = administrativeClassRepository.search(normalizeBlank(keyword), departmentId, majorId, specializationId,
                academicCohortId, normalizePhase(classPhase), isActive);
        List<AdministrativeClassResponse> responses = administrativeClassMapper.toDtoList(classes);
        enrichLookupLabels(responses);
        return responses;
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
        validateReferences(request, null);

        AdministrativeClass administrativeClass = administrativeClassMapper.toEntity(request);
        administrativeClass.setClassCode(classCode);
        administrativeClass.setClassName(request.getClassName().trim());
        administrativeClass.setClassPhase(resolveClassPhase(request.getClassPhase()));
        administrativeClass.setIsActive(request.getIsActive() == null || request.getIsActive());
        return toResponse(administrativeClassRepository.save(administrativeClass));
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
        if (StringUtils.hasText(request.getClassPhase())) administrativeClass.setClassPhase(resolveClassPhase(request.getClassPhase()));
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

    private AdministrativeClassResponse toResponse(AdministrativeClass administrativeClass) {
        AdministrativeClassResponse response = administrativeClassMapper.toDto(administrativeClass);
        enrichLookupLabels(response);
        return response;
    }

    private void enrichLookupLabels(AdministrativeClassResponse response) {
        if (response.getDepartmentId() != null) {
            departmentRepository.findById(response.getDepartmentId()).ifPresent(department -> {
                response.setDepartmentCode(department.getCode());
                response.setDepartmentName(department.getName());
            });
        }
        if (response.getMajorId() != null) {
            majorRepository.findById(response.getMajorId()).ifPresent(major -> {
                response.setMajorCode(major.getCode());
                response.setMajorName(major.getName());
            });
        }
        if (response.getSpecializationId() != null) {
            specializationRepository.findById(response.getSpecializationId()).ifPresent(specialization -> {
                response.setSpecializationCode(specialization.getCode());
                response.setSpecializationName(specialization.getName());
            });
        }
        if (response.getAcademicCohortId() != null) {
            academicCohortRepository.findById(response.getAcademicCohortId()).ifPresent(cohort -> {
                response.setAcademicCohortCode(cohort.getCode());
                response.setAcademicCohortName(cohort.getName());
            });
        }
        if (response.getAdvisorId() != null) {
            instructorProfileRepository.findById(response.getAdvisorId()).ifPresent(advisor -> {
                response.setAdvisorCode(advisor.getInstructorCode());
                if (advisor.getEmployee() != null && advisor.getEmployee().getPerson() != null) {
                    response.setAdvisorName(advisor.getEmployee().getPerson().getFullName());
                }
            });
        }
    }

    private void enrichLookupLabels(List<AdministrativeClassResponse> responses) {
        if (responses.isEmpty()) {
            return;
        }

        Map<UUID, Department> departmentsById = departmentRepository.findAllById(collectIds(responses, AdministrativeClassResponse::getDepartmentId))
                .stream()
                .collect(Collectors.toMap(Department::getDepartmentId, Function.identity()));
        Map<UUID, Major> majorsById = majorRepository.findAllById(collectIds(responses, AdministrativeClassResponse::getMajorId))
                .stream()
                .collect(Collectors.toMap(Major::getMajorId, Function.identity()));
        Map<UUID, Specialization> specializationsById = specializationRepository.findAllById(collectIds(responses, AdministrativeClassResponse::getSpecializationId))
                .stream()
                .collect(Collectors.toMap(Specialization::getSpecializationId, Function.identity()));
        Map<UUID, AcademicCohort> cohortsById = academicCohortRepository.findAllById(collectIds(responses, AdministrativeClassResponse::getAcademicCohortId))
                .stream()
                .collect(Collectors.toMap(AcademicCohort::getCohortId, Function.identity()));
        Set<UUID> advisorIds = collectIds(responses, AdministrativeClassResponse::getAdvisorId);
        Map<UUID, InstructorProfile> advisorsById = advisorIds.isEmpty()
                ? Map.of()
                : instructorProfileRepository.findActiveByEmployeeIds(advisorIds)
                        .stream()
                        .collect(Collectors.toMap(InstructorProfile::getEmployeeId, Function.identity()));

        responses.forEach(response -> {
            Department department = departmentsById.get(response.getDepartmentId());
            if (department != null) {
                response.setDepartmentCode(department.getCode());
                response.setDepartmentName(department.getName());
            }

            Major major = majorsById.get(response.getMajorId());
            if (major != null) {
                response.setMajorCode(major.getCode());
                response.setMajorName(major.getName());
            }

            Specialization specialization = specializationsById.get(response.getSpecializationId());
            if (specialization != null) {
                response.setSpecializationCode(specialization.getCode());
                response.setSpecializationName(specialization.getName());
            }

            AcademicCohort cohort = cohortsById.get(response.getAcademicCohortId());
            if (cohort != null) {
                response.setAcademicCohortCode(cohort.getCode());
                response.setAcademicCohortName(cohort.getName());
            }

            InstructorProfile advisor = advisorsById.get(response.getAdvisorId());
            if (advisor != null) {
                response.setAdvisorCode(advisor.getInstructorCode());
                if (advisor.getEmployee() != null && advisor.getEmployee().getPerson() != null) {
                    response.setAdvisorName(advisor.getEmployee().getPerson().getFullName());
                }
            }
        });
    }

    private Set<UUID> collectIds(List<AdministrativeClassResponse> responses, Function<AdministrativeClassResponse, UUID> extractor) {
        return responses.stream()
                .map(extractor)
                .filter(Objects::nonNull)
                .collect(Collectors.toSet());
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
        validateMajorAndSpecialization(request.getDepartmentId(), request.getMajorId(), request.getSpecializationId(), resolveClassPhase(request.getClassPhase()));
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

    private void validateMajorAndSpecialization(UUID departmentId, UUID majorId, UUID specializationId, String classPhase) {
        if (majorId != null) {
            Major major = majorRepository.findById(majorId)
                    .orElseThrow(() -> new ResourceNotFoundException("Không tìm thấy ngành của lớp hành chính"));
            if (departmentId != null && major.getDepartmentId() != null && !departmentId.equals(major.getDepartmentId())) {
                throw new BusinessException("Ngành không thuộc khoa của lớp hành chính");
            }
        }
        if (specializationId != null) {
            if (majorId == null) {
                throw new BusinessException("Lớp chuyên ngành phải chọn ngành");
            }
            Specialization specialization = specializationRepository.findById(specializationId)
                    .orElseThrow(() -> new ResourceNotFoundException("Không tìm thấy chuyên ngành của lớp hành chính"));
            if ((departmentId != null && !departmentId.equals(specialization.getDepartmentId()))
                    || !majorId.equals(specialization.getMajorId())) {
                throw new BusinessException("Chuyên ngành không thuộc khoa/ngành của lớp hành chính");
            }
        }
        if ("SPECIALIZATION".equals(classPhase) && specializationId == null) {
            throw new BusinessException("Lớp giai đoạn chuyên ngành phải chọn chuyên ngành");
        }
    }

    private String resolveClassPhase(String value) {
        String phase = normalizePhase(value);
        return phase == null ? "FOUNDATION" : phase;
    }

    private String normalizePhase(String value) {
        return StringUtils.hasText(value) ? value.trim().toUpperCase(Locale.ROOT) : null;
    }
}

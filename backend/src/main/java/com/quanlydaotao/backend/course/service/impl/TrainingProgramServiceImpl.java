package com.quanlydaotao.backend.course.service.impl;

import com.quanlydaotao.backend.course.dto.CreateTrainingProgramRequest;
import com.quanlydaotao.backend.course.dto.TrainingProgramDto;
import com.quanlydaotao.backend.course.entity.Major;
import com.quanlydaotao.backend.course.entity.TrainingProgram;
import com.quanlydaotao.backend.course.repository.MajorRepository;
import com.quanlydaotao.backend.course.repository.TrainingProgramRepository;
import com.quanlydaotao.backend.course.service.TrainingProgramService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class TrainingProgramServiceImpl implements TrainingProgramService {

    private final TrainingProgramRepository trainingProgramRepository;
    private final MajorRepository majorRepository;

    @Override
    @Transactional(readOnly = true)
    public Page<TrainingProgramDto> getAllPrograms(String keyword, UUID majorId, Pageable pageable) {
        return trainingProgramRepository.findAll(pageable).map(this::mapToDto);
    }

    @Override
    @Transactional(readOnly = true)
    public TrainingProgramDto getProgramById(UUID id) {
        return trainingProgramRepository.findById(id).map(this::mapToDto)
                .orElseThrow(() -> new RuntimeException("Training Program not found"));
    }

    @Override
    @Transactional
    public TrainingProgramDto createProgram(CreateTrainingProgramRequest request) {
        Major major = majorRepository.findById(request.getMajorId())
                .orElseThrow(() -> new RuntimeException("Major not found"));
        
        TrainingProgram program = new TrainingProgram();
<<<<<<< HEAD
        program.setCode(request.getProgramCode());
        program.setName(request.getProgramName());
        program.setMajorId(major.getMajorId());
=======
        program.setProgramCode(request.getProgramCode());
        program.setProgramName(request.getProgramName());
        program.setMajor(major);
        program.setDepartmentId(major.getDepartmentId());
        program.setAcademicCohortId(request.getAcademicCohortId());
        program.setAcademicYear(request.getAcademicYear());
>>>>>>> eb2033de817f51357d899eb8aec3941270d66d64
        program.setTotalCredits(request.getTotalCredits());
        program.setDescription(request.getDescription());
        program.setIsActive(true);
        
        return mapToDto(trainingProgramRepository.save(program));
    }

    @Override
    @Transactional
    public TrainingProgramDto updateProgram(UUID id, CreateTrainingProgramRequest request) {
        TrainingProgram program = trainingProgramRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Training Program not found"));
        
<<<<<<< HEAD
        program.setCode(request.getProgramCode());
        program.setName(request.getProgramName());
        program.setMajorId(request.getMajorId());
=======
        Major major = majorRepository.findById(request.getMajorId())
                .orElseThrow(() -> new RuntimeException("Major not found"));
        
        program.setProgramCode(request.getProgramCode());
        program.setProgramName(request.getProgramName());
        program.setMajor(major);
        program.setDepartmentId(major.getDepartmentId());
        program.setAcademicCohortId(request.getAcademicCohortId());
        program.setAcademicYear(request.getAcademicYear());
>>>>>>> eb2033de817f51357d899eb8aec3941270d66d64
        program.setTotalCredits(request.getTotalCredits());
        program.setDescription(request.getDescription());
        
        return mapToDto(trainingProgramRepository.save(program));
    }

    @Override
    @Transactional
    public void deleteProgram(UUID id) {
        TrainingProgram program = trainingProgramRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Training Program not found"));
        program.setIsActive(false);
        trainingProgramRepository.save(program);
    }

    @Override
    public List<TrainingProgramDto> getAllTrainingProgramsList() {
        return trainingProgramRepository.findAll().stream()
                .map(this::mapToDto)
                .collect(Collectors.toList());
    }

    // ✅ SỬA LẠI mapToDto - DÙNG ĐÚNG TÊN FIELD
    private TrainingProgramDto mapToDto(TrainingProgram entity) {
        TrainingProgramDto dto = new TrainingProgramDto();
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
}
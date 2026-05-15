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

import java.util.UUID;

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
        program.setProgramCode(request.getProgramCode());
        program.setProgramName(request.getProgramName());
        program.setMajor(major);
        program.setDepartmentId(major.getDepartmentId());
        program.setAcademicCohortId(request.getAcademicCohortId());
        program.setAcademicYear(request.getAcademicYear());
        program.setTotalCredits(request.getTotalCredits());
        program.setDescription(request.getDescription());
        program.setNote(request.getNote());
        
        return mapToDto(trainingProgramRepository.save(program));
    }

    @Override
    @Transactional
    public TrainingProgramDto updateProgram(UUID id, CreateTrainingProgramRequest request) {
        TrainingProgram program = trainingProgramRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Training Program not found"));
        
        Major major = majorRepository.findById(request.getMajorId())
                .orElseThrow(() -> new RuntimeException("Major not found"));
        
        program.setProgramCode(request.getProgramCode());
        program.setProgramName(request.getProgramName());
        program.setMajor(major);
        program.setDepartmentId(major.getDepartmentId());
        program.setAcademicCohortId(request.getAcademicCohortId());
        program.setAcademicYear(request.getAcademicYear());
        program.setTotalCredits(request.getTotalCredits());
        program.setDescription(request.getDescription());
        program.setNote(request.getNote());
        
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

    private TrainingProgramDto mapToDto(TrainingProgram entity) {
        TrainingProgramDto dto = new TrainingProgramDto();
        dto.setProgramId(entity.getProgramId());
        dto.setProgramCode(entity.getProgramCode());
        dto.setProgramName(entity.getProgramName());
        dto.setMajorId(entity.getMajor().getMajorId());
        dto.setAcademicYear(entity.getAcademicYear());
        dto.setTotalCredits(entity.getTotalCredits());
        dto.setDescription(entity.getDescription());
        dto.setStatus(entity.getStatus());
        return dto;
    }
}

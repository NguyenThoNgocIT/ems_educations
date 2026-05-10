package com.quanlydaotao.backend.trainingprogram.service.impl;

import com.quanlydaotao.backend.common.exception.ResourceNotFoundException;
import com.quanlydaotao.backend.trainingprogram.dto.request.CreateTrainingProgramRequest;
import com.quanlydaotao.backend.trainingprogram.dto.request.TrainingProgramSearchRequest;
import com.quanlydaotao.backend.trainingprogram.dto.request.UpdateTrainingProgramRequest;
import com.quanlydaotao.backend.trainingprogram.dto.response.TrainingProgramDetailResponse;
import com.quanlydaotao.backend.trainingprogram.dto.response.TrainingProgramResponse;
import com.quanlydaotao.backend.trainingprogram.entity.TrainingProgram;
import com.quanlydaotao.backend.trainingprogram.mapper.TrainingProgramMapper;
import com.quanlydaotao.backend.trainingprogram.repository.TrainingProgramRepository;
import com.quanlydaotao.backend.trainingprogram.service.TrainingProgramService;
import com.quanlydaotao.backend.trainingprogram.spec.TrainingProgramSpecification;
import com.quanlydaotao.backend.trainingprogram.validator.TrainingProgramValidator;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class TrainingProgramServiceImpl implements TrainingProgramService {

    private final TrainingProgramRepository trainingProgramRepository;
    private final TrainingProgramMapper trainingProgramMapper;
    private final TrainingProgramValidator trainingProgramValidator;

    @Override
    @Transactional
    public TrainingProgramResponse createTrainingProgram(CreateTrainingProgramRequest request) {
        trainingProgramValidator.validateCreateTrainingProgram(request);
        
        TrainingProgram trainingProgram = trainingProgramMapper.toEntity(request);
        trainingProgram = trainingProgramRepository.save(trainingProgram);
        
        return trainingProgramMapper.toResponse(trainingProgram);
    }

    @Override
    @Transactional
    public TrainingProgramResponse updateTrainingProgram(UUID id, UpdateTrainingProgramRequest request) {
        TrainingProgram trainingProgram = trainingProgramRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Không tìm thấy chương trình đào tạo với ID: " + id));
        
        trainingProgramValidator.validateUpdateTrainingProgram(trainingProgram, request);
        trainingProgramMapper.updateEntity(request, trainingProgram);
        
        trainingProgram = trainingProgramRepository.save(trainingProgram);
        return trainingProgramMapper.toResponse(trainingProgram);
    }

    @Override
    @Transactional(readOnly = true)
    public TrainingProgramDetailResponse getTrainingProgramById(UUID id) {
        TrainingProgram trainingProgram = trainingProgramRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Không tìm thấy chương trình đào tạo với ID: " + id));
        
        return trainingProgramMapper.toDetailResponse(trainingProgram);
    }

    @Override
    @Transactional(readOnly = true)
    public Page<TrainingProgramResponse> searchTrainingPrograms(TrainingProgramSearchRequest request, Pageable pageable) {
        var spec = TrainingProgramSpecification.filterByCriteria(request);
        Page<TrainingProgram> trainingPrograms = trainingProgramRepository.findAll(spec, pageable);
        return trainingPrograms.map(trainingProgramMapper::toResponse);
    }

    @Override
    @Transactional
    public void deleteTrainingProgram(UUID id) {
        TrainingProgram trainingProgram = trainingProgramRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Không tìm thấy chương trình đào tạo với ID: " + id));
        
        trainingProgramValidator.validateBeforeDelete(trainingProgram);
        
        trainingProgram.setDeletedAt(LocalDateTime.now());
        trainingProgram.setIsActive(false);
        trainingProgramRepository.save(trainingProgram);
    }
}
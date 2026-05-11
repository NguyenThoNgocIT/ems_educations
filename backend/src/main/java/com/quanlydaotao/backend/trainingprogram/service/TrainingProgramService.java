package com.quanlydaotao.backend.trainingprogram.service;

import com.quanlydaotao.backend.trainingprogram.dto.request.CreateTrainingProgramRequest;
import com.quanlydaotao.backend.trainingprogram.dto.request.TrainingProgramSearchRequest;
import com.quanlydaotao.backend.trainingprogram.dto.request.UpdateTrainingProgramRequest;
import com.quanlydaotao.backend.trainingprogram.dto.response.TrainingProgramDetailResponse;
import com.quanlydaotao.backend.trainingprogram.dto.response.TrainingProgramResponse;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import java.util.UUID;

public interface TrainingProgramService {
    
    TrainingProgramResponse createTrainingProgram(CreateTrainingProgramRequest request);
    
    TrainingProgramResponse updateTrainingProgram(UUID id, UpdateTrainingProgramRequest request);
    
    TrainingProgramDetailResponse getTrainingProgramById(UUID id);
    
    Page<TrainingProgramResponse> searchTrainingPrograms(TrainingProgramSearchRequest request, Pageable pageable);
    
    void deleteTrainingProgram(UUID id);
}
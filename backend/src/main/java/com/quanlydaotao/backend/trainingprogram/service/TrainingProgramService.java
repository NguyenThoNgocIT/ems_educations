package com.quanlydaotao.backend.trainingprogram.service;

import com.quanlydaotao.backend.trainingprogram.dto.TrainingProgramRequest;
import com.quanlydaotao.backend.trainingprogram.dto.TrainingProgramResponse;

import java.util.List;
import java.util.UUID;

public interface TrainingProgramService {
    List<TrainingProgramResponse> getAllPrograms(String keyword, UUID majorId, UUID specializationId, UUID departmentId,
                                                 UUID academicCohortId, String programPhase, Boolean isActive);

    TrainingProgramResponse getProgramById(UUID id);

    TrainingProgramResponse createProgram(TrainingProgramRequest request);

    TrainingProgramResponse updateProgram(UUID id, TrainingProgramRequest request);

    List<TrainingProgramResponse> getAllTrainingProgramsList();

    void deleteProgram(UUID id);
}

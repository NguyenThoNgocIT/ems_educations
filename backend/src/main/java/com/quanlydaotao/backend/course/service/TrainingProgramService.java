package com.quanlydaotao.backend.course.service;

import com.quanlydaotao.backend.course.dto.CreateTrainingProgramRequest;
import com.quanlydaotao.backend.course.dto.TrainingProgramDto;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import java.util.UUID;

public interface TrainingProgramService {
    Page<TrainingProgramDto> getAllPrograms(String keyword, UUID majorId, Pageable pageable);
    TrainingProgramDto getProgramById(UUID id);
    TrainingProgramDto createProgram(CreateTrainingProgramRequest request);
    TrainingProgramDto updateProgram(UUID id, CreateTrainingProgramRequest request);
    void deleteProgram(UUID id);
}

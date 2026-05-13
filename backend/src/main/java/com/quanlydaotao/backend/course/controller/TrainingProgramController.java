package com.quanlydaotao.backend.course.controller;

import com.quanlydaotao.backend.course.dto.CreateTrainingProgramRequest;
import com.quanlydaotao.backend.course.dto.TrainingProgramDto;
import com.quanlydaotao.backend.course.service.TrainingProgramService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.UUID;

@RestController
@RequestMapping("/api/training-programs")
@RequiredArgsConstructor
public class TrainingProgramController {

    private final TrainingProgramService trainingProgramService;

    @GetMapping
    public ResponseEntity<Page<TrainingProgramDto>> getAllPrograms(
            @RequestParam(required = false) String keyword,
            @RequestParam(required = false) UUID majorId,
            Pageable pageable) {
        return ResponseEntity.ok(trainingProgramService.getAllPrograms(keyword, majorId, pageable));
    }

    @GetMapping("/{id}")
    public ResponseEntity<TrainingProgramDto> getProgramById(@PathVariable UUID id) {
        return ResponseEntity.ok(trainingProgramService.getProgramById(id));
    }

    @PostMapping
    public ResponseEntity<TrainingProgramDto> createProgram(@Valid @RequestBody CreateTrainingProgramRequest request) {
        return ResponseEntity.ok(trainingProgramService.createProgram(request));
    }

    @PutMapping("/{id}")
    public ResponseEntity<TrainingProgramDto> updateProgram(@PathVariable UUID id, @Valid @RequestBody CreateTrainingProgramRequest request) {
        return ResponseEntity.ok(trainingProgramService.updateProgram(id, request));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteProgram(@PathVariable UUID id) {
        trainingProgramService.deleteProgram(id);
        return ResponseEntity.noContent().build();
    }
}

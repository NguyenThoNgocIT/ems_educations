package com.quanlydaotao.backend.trainingprogram;

import jakarta.validation.Valid;
import java.util.List;
import java.util.UUID;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/v1/admin/training-programs")
@RequiredArgsConstructor
@PreAuthorize("hasRole('ADMIN')")
public class TrainingProgramController {

    private final TrainingProgramService trainingProgramService;

    @GetMapping
    public ResponseEntity<List<TrainingProgram>> getAllTrainingPrograms() {
        return ResponseEntity.ok(trainingProgramService.getAllTrainingPrograms());
    }

    @GetMapping("/{id}")
    public ResponseEntity<TrainingProgram> getTrainingProgramById(@PathVariable UUID id) {
        return ResponseEntity.ok(trainingProgramService.getTrainingProgramById(id));
    }

    @PostMapping
    public ResponseEntity<TrainingProgram> createTrainingProgram(@Valid @RequestBody TrainingProgramRequest request) {
        return ResponseEntity.ok(trainingProgramService.createTrainingProgram(request));
    }

    @PutMapping("/{id}")
    public ResponseEntity<TrainingProgram> updateTrainingProgram(
            @PathVariable UUID id,
            @Valid @RequestBody TrainingProgramRequest request
    ) {
        return ResponseEntity.ok(trainingProgramService.updateTrainingProgram(id, request));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<String> deleteTrainingProgram(@PathVariable UUID id) {
        trainingProgramService.deleteTrainingProgram(id);
        return ResponseEntity.ok("Training program deleted successfully");
    }

    @GetMapping("/search")
    public ResponseEntity<List<TrainingProgram>> searchTrainingPrograms(@RequestParam(required = false) String keyword) {
        return ResponseEntity.ok(trainingProgramService.searchTrainingPrograms(keyword));
    }

    @GetMapping("/details")
    public ResponseEntity<List<TrainingProgramService.TrainingProgramDetailsResponse>> getTrainingProgramDetails() {
        return ResponseEntity.ok(trainingProgramService.getTrainingProgramDetails());
    }

    @GetMapping("/page")
    public ResponseEntity<Page<TrainingProgram>> getTrainingProgramPage(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size
    ) {
        return ResponseEntity.ok(trainingProgramService.getTrainingProgramsPage(page, size));
    }
}

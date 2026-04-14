package com.quanlydaotao.backend.semester;

import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import java.util.List;
import java.util.UUID;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
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
@RequestMapping("/api/v1/admin/semesters")
@RequiredArgsConstructor
@Tag(name = "semester-controller")
public class SemesterController {

    private final SemesterService semesterService;

    @GetMapping
    public ResponseEntity<List<Semester>> getAllSemesters() {
        return ResponseEntity.ok(semesterService.getAllSemesters());
    }

    @GetMapping("/active")
    public ResponseEntity<List<Semester>> getActiveSemesters() {
        return ResponseEntity.ok(semesterService.getActiveSemesters());
    }

    @GetMapping("/{id}")
    public ResponseEntity<Semester> getSemesterById(@PathVariable UUID id) {
        return ResponseEntity.ok(semesterService.getSemesterById(id));
    }

    @GetMapping("/by-year/{academicYear}")
    public ResponseEntity<List<Semester>> getSemestersByAcademicYear(@PathVariable String academicYear) {
        return ResponseEntity.ok(semesterService.getSemestersByAcademicYear(academicYear));
    }

    @PostMapping
    public ResponseEntity<Semester> createSemester(@Valid @RequestBody SemesterRequest request) {
        return ResponseEntity.ok(semesterService.createSemester(request));
    }

    @PutMapping("/{id}")
    public ResponseEntity<Semester> updateSemester(@PathVariable UUID id, @Valid @RequestBody SemesterRequest request) {
        return ResponseEntity.ok(semesterService.updateSemester(id, request));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteSemester(@PathVariable UUID id) {
        semesterService.deleteSemester(id);
        return ResponseEntity.noContent().build();
    }
}

package com.quanlydaotao.backend.course.controller;

import com.quanlydaotao.backend.course.entity.AcademicCohort;
import com.quanlydaotao.backend.course.repository.AcademicCohortRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
    
@RestController
@RequestMapping("/api/academic-cohorts")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class AcademicCohortController {

    private final AcademicCohortRepository academicCohortRepository;

    @GetMapping
    public ResponseEntity<List<AcademicCohort>> getAll() {
        return ResponseEntity.ok(academicCohortRepository.findAll());
    }

    @PostMapping
    public ResponseEntity<AcademicCohort> create(@RequestBody AcademicCohort cohort) {
        return ResponseEntity.ok(academicCohortRepository.save(cohort));
    }
}

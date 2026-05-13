package com.quanlydaotao.backend.course.controller;

import com.quanlydaotao.backend.course.dto.CreateMajorRequest;
import com.quanlydaotao.backend.course.dto.MajorDto;
import com.quanlydaotao.backend.course.service.MajorService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.UUID;

@RestController
@RequestMapping("/api/majors")
@RequiredArgsConstructor
public class MajorController {

    private final MajorService majorService;

    @GetMapping
    public ResponseEntity<Page<MajorDto>> getAllMajors(
            @RequestParam(required = false) String keyword,
            @RequestParam(required = false) UUID departmentId,
            Pageable pageable) {
        return ResponseEntity.ok(majorService.getAllMajors(keyword, departmentId, pageable));
    }

    @GetMapping("/{id}")
    public ResponseEntity<MajorDto> getMajorById(@PathVariable UUID id) {
        return ResponseEntity.ok(majorService.getMajorById(id));
    }

    @PostMapping
    public ResponseEntity<MajorDto> createMajor(@Valid @RequestBody CreateMajorRequest request) {
        return ResponseEntity.ok(majorService.createMajor(request));
    }

    @PutMapping("/{id}")
    public ResponseEntity<MajorDto> updateMajor(@PathVariable UUID id, @Valid @RequestBody CreateMajorRequest request) {
        return ResponseEntity.ok(majorService.updateMajor(id, request));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteMajor(@PathVariable UUID id) {
        majorService.deleteMajor(id);
        return ResponseEntity.noContent().build();
    }
}

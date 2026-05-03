package com.quanlydaotao.backend.lecturer.controller;
import com.quanlydaotao.backend.lecturer.dto.LecturerCreateRequest;
import com.quanlydaotao.backend.lecturer.dto.LecturerProfileDto;
import com.quanlydaotao.backend.lecturer.dto.LecturerUpdateRequest;
import com.quanlydaotao.backend.lecturer.service.LecturerService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;
import java.util.UUID;
@RestController
@RequestMapping("/api/v1/lecturers")
@RequiredArgsConstructor
public class LecturerController {
    private final LecturerService lecturerService;
    @PostMapping
    public ResponseEntity<LecturerProfileDto> createLecturer(@RequestBody LecturerCreateRequest request) {
        return new ResponseEntity<>(lecturerService.createLecturer(request), HttpStatus.CREATED);
    }
    @GetMapping("/{id}")
    public ResponseEntity<LecturerProfileDto> getLecturerById(@PathVariable UUID id) {
        return ResponseEntity.ok(lecturerService.getLecturerById(id));
    }
    @GetMapping
    public ResponseEntity<List<LecturerProfileDto>> getAllLecturers() {
        return ResponseEntity.ok(lecturerService.getAllLecturers());
    }
    @PutMapping("/{id}")
    public ResponseEntity<LecturerProfileDto> updateLecturer(@PathVariable UUID id, @RequestBody LecturerUpdateRequest request) {
        return ResponseEntity.ok(lecturerService.updateLecturer(id, request));
    }
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteLecturer(@PathVariable UUID id) {
        lecturerService.deleteLecturer(id);
        return ResponseEntity.noContent().build();
    }
}


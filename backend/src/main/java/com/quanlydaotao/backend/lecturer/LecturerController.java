package com.quanlydaotao.backend.lecturer;

import jakarta.validation.Valid;
import java.util.List;
import java.util.UUID;
import lombok.RequiredArgsConstructor;
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
@RequestMapping("/api/v1/admin/lecturers")
@RequiredArgsConstructor
@PreAuthorize("hasRole('ADMIN')")
public class LecturerController {

    private final LecturerService lecturerService;

    @GetMapping
    public ResponseEntity<List<Lecturer>> getAllLecturers() {
        return ResponseEntity.ok(lecturerService.getAllLecturers());
    }

    @GetMapping("/{id}")
    public ResponseEntity<Lecturer> getLecturerById(@PathVariable UUID id) {
        return ResponseEntity.ok(lecturerService.getLecturerById(id));
    }

    @PostMapping
    public ResponseEntity<Lecturer> createLecturer(@Valid @RequestBody Lecturer lecturer) {
        return ResponseEntity.ok(lecturerService.createLecturer(lecturer));
    }

    @PutMapping("/{id}")
    public ResponseEntity<Lecturer> updateLecturer(
            @PathVariable UUID id,
            @Valid @RequestBody Lecturer lecturer
    ) {
        return ResponseEntity.ok(lecturerService.updateLecturer(id, lecturer));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<String> deleteLecturer(@PathVariable UUID id) {
        lecturerService.deleteLecturer(id);
        return ResponseEntity.ok("Lecturer deleted successfully");
    }

    @GetMapping("/search")
    public ResponseEntity<List<Lecturer>> searchLecturers(
            @RequestParam(required = false) String keyword
    ) {
        return ResponseEntity.ok(lecturerService.searchLecturers(keyword));
    }

    @GetMapping("/department")
    public ResponseEntity<List<Lecturer>> getLecturersByDepartment(
            @RequestParam String departmentId
    ) {
        return ResponseEntity.ok(lecturerService.getLecturersByDepartment(departmentId));
    }
}

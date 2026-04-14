package com.quanlydaotao.backend.lecturercourseclass;

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
@RequestMapping("/api/v1/admin/lecturer-course-classes")
@RequiredArgsConstructor
@Tag(name = "lecturer-course-class-controller")
public class LecturerCourseClassController {

    private final LecturerCourseClassService service;

    @PostMapping
    public ResponseEntity<LecturerCourseClass> createAssignment(@Valid @RequestBody LecturerCourseClassRequest request) {
        return ResponseEntity.ok(service.createAssignment(request));
    }

    @GetMapping
    public ResponseEntity<List<LecturerCourseClass>> getAllAssignments() {
        return ResponseEntity.ok(service.getAllAssignments());
    }

    @GetMapping("/{id}")
    public ResponseEntity<LecturerCourseClass> getAssignmentById(@PathVariable UUID id) {
        return ResponseEntity.ok(service.getAssignmentById(id));
    }

    @GetMapping("/search")
    public ResponseEntity<List<LecturerCourseClass>> searchAssignments(
            @RequestParam(required = false) UUID lecturerId,
            @RequestParam(required = false) UUID courseClassId,
            @RequestParam(required = false) String role,
            @RequestParam(required = false) Boolean isActive
    ) {
        return ResponseEntity.ok(service.searchAssignments(lecturerId, courseClassId, role, isActive));
    }

    @GetMapping("/by-lecturer/{lecturerId}")
    public ResponseEntity<List<LecturerCourseClass>> getByLecturer(@PathVariable UUID lecturerId) {
        return ResponseEntity.ok(service.getByLecturer(lecturerId));
    }

    @GetMapping("/by-class/{classId}")
    public ResponseEntity<List<LecturerCourseClass>> getByCourseClass(@PathVariable("classId") UUID classId) {
        return ResponseEntity.ok(service.getByCourseClass(classId));
    }

    @PutMapping("/{id}")
    public ResponseEntity<LecturerCourseClass> updateAssignment(@PathVariable UUID id, @Valid @RequestBody LecturerCourseClassRequest request) {
        return ResponseEntity.ok(service.updateAssignment(id, request));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteAssignment(@PathVariable UUID id) {
        service.deleteAssignment(id);
        return ResponseEntity.noContent().build();
    }
}

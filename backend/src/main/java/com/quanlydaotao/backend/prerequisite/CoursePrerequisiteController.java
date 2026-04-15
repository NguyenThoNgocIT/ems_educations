package com.quanlydaotao.backend.prerequisite;

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
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/v1/admin/prerequisites")
@RequiredArgsConstructor
@PreAuthorize("hasAnyRole('ADMIN','MANAGER')")
public class CoursePrerequisiteController {

    private final CoursePrerequisiteService coursePrerequisiteService;

    @GetMapping
    public ResponseEntity<List<CoursePrerequisite>> getAllPrerequisites() {
        return ResponseEntity.ok(coursePrerequisiteService.getAllPrerequisites());
    }

    @PostMapping
    public ResponseEntity<CoursePrerequisite> createPrerequisite(@Valid @RequestBody CoursePrerequisiteRequest request) {
        return ResponseEntity.ok(coursePrerequisiteService.createPrerequisite(request));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<String> deletePrerequisite(@PathVariable UUID id) {
        coursePrerequisiteService.deletePrerequisite(id);
        return ResponseEntity.ok("Prerequisite deleted successfully");
    }

    @GetMapping("/course/{courseId}")
    public ResponseEntity<List<CoursePrerequisite>> getPrerequisitesByCourse(@PathVariable UUID courseId) {
        return ResponseEntity.ok(coursePrerequisiteService.getPrerequisitesByCourse(courseId));
    }
}

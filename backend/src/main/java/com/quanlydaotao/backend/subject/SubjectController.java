package com.quanlydaotao.backend.subject;

import jakarta.validation.Valid;
import java.util.List;
import java.util.UUID;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/v1/admin/subjects")
@RequiredArgsConstructor
@PreAuthorize("hasRole('ADMIN')")
public class SubjectController {

    private final SubjectService subjectService;

    @GetMapping
    public ResponseEntity<List<Subject>> getAllSubjects() {
        return ResponseEntity.ok(subjectService.getAllSubjects());
    }

    @GetMapping("/{id}")
    public ResponseEntity<Subject> getSubjectById(@PathVariable UUID id) {
        return ResponseEntity.ok(subjectService.getSubjectById(id));
    }

    @PostMapping
    public ResponseEntity<Subject> createSubject(@Valid @RequestBody SubjectRequest request) {
        return ResponseEntity.ok(subjectService.createSubject(request));
    }

    @PutMapping("/{id}")
    public ResponseEntity<Subject> updateSubject(
            @PathVariable UUID id,
            @Valid @RequestBody SubjectRequest request
    ) {
        return ResponseEntity.ok(subjectService.updateSubject(id, request));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<String> softDeleteSubject(@PathVariable UUID id) {
        subjectService.softDeleteSubject(id);
        return ResponseEntity.ok("Subject deleted successfully");
    }

    @DeleteMapping("/hard/{id}")
    public ResponseEntity<String> hardDeleteSubject(@PathVariable UUID id) {
        subjectService.hardDeleteSubject(id);
        return ResponseEntity.ok("Subject hard deleted successfully");
    }

    @PatchMapping("/{id}/restore")
    public ResponseEntity<Subject> restoreSubject(@PathVariable UUID id) {
        return ResponseEntity.ok(subjectService.restoreSubject(id));
    }

    @GetMapping("/search")
    public ResponseEntity<List<Subject>> searchSubjects(@RequestParam(required = false) String keyword) {
        return ResponseEntity.ok(subjectService.searchSubjects(keyword));
    }

    @GetMapping("/page")
    public ResponseEntity<Page<Subject>> getSubjectsPage(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size
    ) {
        return ResponseEntity.ok(subjectService.getSubjectsPage(page, size));
    }
}

package com.quanlydaotao.backend.graduationresult;

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
@RequestMapping("/api/v1/admin/graduation-results")
@RequiredArgsConstructor
@Tag(name = "graduation-result-controller")
public class GraduationResultController {

    private final GraduationResultService resultService;

    @GetMapping
    public ResponseEntity<List<GraduationResult>> getAllResults() {
        return ResponseEntity.ok(resultService.getAllResults());
    }

    @GetMapping("/{id}")
    public ResponseEntity<GraduationResult> getResultById(@PathVariable UUID id) {
        return ResponseEntity.ok(resultService.getResultById(id));
    }

    @GetMapping("/student/{studentId}")
    public ResponseEntity<List<GraduationResult>> getResultsByStudent(@PathVariable UUID studentId) {
        return ResponseEntity.ok(resultService.getResultsByStudent(studentId));
    }

    @GetMapping("/status/{status}")
    public ResponseEntity<List<GraduationResult>> getResultsByStatus(@PathVariable String status) {
        return ResponseEntity.ok(resultService.getResultsByStatus(status));
    }

    @GetMapping("/rank/{graduationRank}")
    public ResponseEntity<List<GraduationResult>> getResultsByRank(@PathVariable String graduationRank) {
        return ResponseEntity.ok(resultService.getResultsByRank(graduationRank));
    }

    @GetMapping("/search")
    public ResponseEntity<List<GraduationResult>> searchResults(@RequestParam(required = false) String keyword) {
        return ResponseEntity.ok(resultService.searchResults(keyword));
    }

    @PostMapping
    public ResponseEntity<GraduationResult> createResult(@Valid @RequestBody GraduationResultRequest request) {
        return ResponseEntity.ok(resultService.createResult(request));
    }

    @PutMapping("/{id}")
    public ResponseEntity<GraduationResult> updateResult(@PathVariable UUID id, @Valid @RequestBody GraduationResultRequest request) {
        return ResponseEntity.ok(resultService.updateResult(id, request));
    }

    @PutMapping("/{id}/decision")
    public ResponseEntity<GraduationResult> updateDecision(@PathVariable UUID id, @Valid @RequestBody GraduationResultDecisionRequest request) {
        return ResponseEntity.ok(resultService.updateDecision(id, request));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteResult(@PathVariable UUID id) {
        resultService.deleteResult(id);
        return ResponseEntity.noContent().build();
    }
}

package com.quanlydaotao.backend.gradescale;

import io.swagger.v3.oas.annotations.tags.Tag;
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
@RequestMapping("/api/v1/admin/grade-scales")
@RequiredArgsConstructor
@PreAuthorize("hasAnyRole('ADMIN','MANAGER')")
@Tag(name = "grade-scale-controller")
public class GradeScaleController {

    private final GradeScaleService gradeScaleService;

    @GetMapping
    public ResponseEntity<List<GradeScale>> getAllGradeScales() {
        return ResponseEntity.ok(gradeScaleService.getAllGradeScales());
    }

    @GetMapping("/{id}")
    public ResponseEntity<GradeScale> getGradeScaleById(@PathVariable UUID id) {
        return ResponseEntity.ok(gradeScaleService.getGradeScaleById(id));
    }

    @GetMapping("/search")
    public ResponseEntity<List<GradeScale>> searchGradeScales(@RequestParam(required = false) String keyword) {
        return ResponseEntity.ok(gradeScaleService.searchGradeScales(keyword));
    }

    @GetMapping("/convert")
    public ResponseEntity<GradeScaleService.GradeScaleConvertResponse> convertScore(@RequestParam Double score) {
        return ResponseEntity.ok(gradeScaleService.convertScore(score));
    }

    @PostMapping
    public ResponseEntity<GradeScale> createGradeScale(@Valid @RequestBody GradeScaleRequest request) {
        return ResponseEntity.ok(gradeScaleService.createGradeScale(request));
    }

    @PutMapping("/{id}")
    public ResponseEntity<GradeScale> updateGradeScale(@PathVariable UUID id, @Valid @RequestBody GradeScaleRequest request) {
        return ResponseEntity.ok(gradeScaleService.updateGradeScale(id, request));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteGradeScale(@PathVariable UUID id) {
        gradeScaleService.deleteGradeScale(id);
        return ResponseEntity.noContent().build();
    }
}

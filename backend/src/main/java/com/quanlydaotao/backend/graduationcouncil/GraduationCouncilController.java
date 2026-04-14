package com.quanlydaotao.backend.graduationcouncil;

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
@RequestMapping("/api/v1/admin/graduation-councils")
@RequiredArgsConstructor
@Tag(name = "graduation-council-controller")
public class GraduationCouncilController {

    private final GraduationCouncilService councilService;

    @GetMapping
    public ResponseEntity<List<GraduationCouncil>> getAllCouncils() {
        return ResponseEntity.ok(councilService.getAllCouncils());
    }

    @GetMapping("/{id}")
    public ResponseEntity<GraduationCouncil> getCouncilById(@PathVariable UUID id) {
        return ResponseEntity.ok(councilService.getCouncilById(id));
    }

    @GetMapping("/search")
    public ResponseEntity<List<GraduationCouncil>> searchCouncils(@RequestParam(required = false) String keyword) {
        return ResponseEntity.ok(councilService.searchCouncils(keyword));
    }

    @GetMapping("/year/{schoolYear}")
    public ResponseEntity<List<GraduationCouncil>> getCouncilsByYear(@PathVariable String schoolYear) {
        return ResponseEntity.ok(councilService.getCouncilsByYear(schoolYear));
    }

    @GetMapping("/semester/{semester}")
    public ResponseEntity<List<GraduationCouncil>> getCouncilsBySemester(@PathVariable String semester) {
        return ResponseEntity.ok(councilService.getCouncilsBySemester(semester));
    }

    @PostMapping
    public ResponseEntity<GraduationCouncil> createCouncil(@Valid @RequestBody GraduationCouncilRequest request) {
        return ResponseEntity.ok(councilService.createCouncil(request));
    }

    @PutMapping("/{id}")
    public ResponseEntity<GraduationCouncil> updateCouncil(@PathVariable UUID id, @Valid @RequestBody GraduationCouncilRequest request) {
        return ResponseEntity.ok(councilService.updateCouncil(id, request));
    }

    @PutMapping("/{id}/assign-chairman")
    public ResponseEntity<GraduationCouncil> assignChairman(@PathVariable UUID id, @Valid @RequestBody GraduationCouncilUpdateRoleRequest request) {
        return ResponseEntity.ok(councilService.assignChairman(id, request.getUserId()));
    }

    @PutMapping("/{id}/assign-secretary")
    public ResponseEntity<GraduationCouncil> assignSecretary(@PathVariable UUID id, @Valid @RequestBody GraduationCouncilUpdateRoleRequest request) {
        return ResponseEntity.ok(councilService.assignSecretary(id, request.getUserId()));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteCouncil(@PathVariable UUID id) {
        councilService.deleteCouncil(id);
        return ResponseEntity.noContent().build();
    }
}

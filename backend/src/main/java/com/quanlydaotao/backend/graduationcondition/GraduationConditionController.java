package com.quanlydaotao.backend.graduationcondition;

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
@RequestMapping("/api/v1/admin/graduation-conditions")
@RequiredArgsConstructor
@Tag(name = "graduation-condition-controller")
public class GraduationConditionController {

    private final GraduationConditionService conditionService;

    @GetMapping
    public ResponseEntity<List<GraduationCondition>> getAllConditions() {
        return ResponseEntity.ok(conditionService.getAllConditions());
    }

    @GetMapping("/active")
    public ResponseEntity<List<GraduationCondition>> getActiveConditions() {
        return ResponseEntity.ok(conditionService.getActiveConditions());
    }

    @GetMapping("/{id}")
    public ResponseEntity<GraduationCondition> getConditionById(@PathVariable UUID id) {
        return ResponseEntity.ok(conditionService.getConditionById(id));
    }

    @GetMapping("/search")
    public ResponseEntity<List<GraduationCondition>> searchConditions(@RequestParam(required = false) String keyword) {
        return ResponseEntity.ok(conditionService.searchConditions(keyword));
    }

    @PostMapping
    public ResponseEntity<GraduationCondition> createCondition(@Valid @RequestBody GraduationConditionRequest request) {
        return ResponseEntity.ok(conditionService.createCondition(request));
    }

    @PutMapping("/{id}")
    public ResponseEntity<GraduationCondition> updateCondition(@PathVariable UUID id, @Valid @RequestBody GraduationConditionRequest request) {
        return ResponseEntity.ok(conditionService.updateCondition(id, request));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteCondition(@PathVariable UUID id) {
        conditionService.deleteCondition(id);
        return ResponseEntity.noContent().build();
    }
}

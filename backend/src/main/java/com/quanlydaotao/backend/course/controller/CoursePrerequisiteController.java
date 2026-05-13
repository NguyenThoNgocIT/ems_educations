package com.quanlydaotao.backend.course.controller;

import com.quanlydaotao.backend.course.dto.CreatePrerequisiteRequest;
import com.quanlydaotao.backend.course.dto.PrerequisiteDto;
import com.quanlydaotao.backend.course.service.CoursePrerequisiteService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/course-prerequisites")
@RequiredArgsConstructor
public class CoursePrerequisiteController {

    private final CoursePrerequisiteService prerequisiteService;

    @GetMapping("/course/{courseId}")
    public ResponseEntity<List<PrerequisiteDto>> getByCourse(@PathVariable UUID courseId) {
        return ResponseEntity.ok(prerequisiteService.getPrerequisitesByCourse(courseId));
    }

    @PostMapping
    public ResponseEntity<PrerequisiteDto> add(@Valid @RequestBody CreatePrerequisiteRequest request) {
        return ResponseEntity.ok(prerequisiteService.addPrerequisite(request));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable UUID id) {
        prerequisiteService.deletePrerequisite(id);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/check")
    public ResponseEntity<Boolean> check(@RequestParam UUID courseId, @RequestParam UUID prereqId) {
        return ResponseEntity.ok(prerequisiteService.checkExists(courseId, prereqId));
    }
}

package com.quanlydaotao.backend.courseclass;

import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import java.util.List;
import java.util.Map;
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
@RequestMapping("/api/v1/admin/course-classes")
@RequiredArgsConstructor
@Tag(name = "course-class-controller")
public class CourseClassController {

    private final CourseClassService courseClassService;

    @GetMapping
    public ResponseEntity<List<CourseClass>> getAllCourseClasses() {
        return ResponseEntity.ok(courseClassService.getAllCourseClasses());
    }

    @GetMapping("/active")
    public ResponseEntity<List<CourseClass>> getActiveCourseClasses() {
        return ResponseEntity.ok(courseClassService.getActiveCourseClasses());
    }

    @GetMapping("/{id}")
    public ResponseEntity<CourseClass> getCourseClassById(@PathVariable UUID id) {
        return ResponseEntity.ok(courseClassService.getCourseClassById(id));
    }

    @GetMapping("/search")
    public ResponseEntity<List<CourseClass>> searchCourseClasses(
            @RequestParam(required = false) String keyword,
            @RequestParam(required = false) UUID courseId,
            @RequestParam(required = false) UUID semesterId,
            @RequestParam(required = false) Integer status,
            @RequestParam(required = false) String room
    ) {
        return ResponseEntity.ok(courseClassService.searchCourseClasses(keyword, courseId, semesterId, status, room));
    }

    @GetMapping("/stats")
    public ResponseEntity<CourseClassService.CourseClassStats> getCourseClassStats() {
        return ResponseEntity.ok(courseClassService.getCourseClassStats());
    }

    @PostMapping
    public ResponseEntity<CourseClass> createCourseClass(@Valid @RequestBody CourseClassRequest request) {
        return ResponseEntity.ok(courseClassService.createCourseClass(request));
    }

    @PutMapping("/{id}")
    public ResponseEntity<CourseClass> updateCourseClass(@PathVariable UUID id, @Valid @RequestBody CourseClassRequest request) {
        return ResponseEntity.ok(courseClassService.updateCourseClass(id, request));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteCourseClass(@PathVariable UUID id) {
        courseClassService.deleteCourseClass(id);
        return ResponseEntity.noContent().build();
    }
}

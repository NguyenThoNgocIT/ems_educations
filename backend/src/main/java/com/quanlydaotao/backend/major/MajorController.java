package com.quanlydaotao.backend.major;

import jakarta.validation.Valid;
import java.util.List;
import java.util.UUID;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
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
@RequestMapping("/api/v1/admin/majors")
@RequiredArgsConstructor
@PreAuthorize("hasRole('ADMIN')")
public class MajorController {

    private final MajorService majorService;

    @GetMapping
    public ResponseEntity<List<Major>> getAllMajors() {
        return ResponseEntity.ok(majorService.getAllMajors());
    }

    @GetMapping("/{id}")
    public ResponseEntity<Major> getMajorById(@PathVariable UUID id) {
        return ResponseEntity.ok(majorService.getMajorById(id));
    }

    @PostMapping
    public ResponseEntity<Major> createMajor(@Valid @RequestBody MajorRequest request) {
        return ResponseEntity.ok(majorService.createMajor(request));
    }

    @PutMapping("/{id}")
    public ResponseEntity<Major> updateMajor(
            @PathVariable UUID id,
            @Valid @RequestBody MajorRequest request
    ) {
        return ResponseEntity.ok(majorService.updateMajor(id, request));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<String> deleteMajor(@PathVariable UUID id) {
        majorService.deleteMajor(id);
        return ResponseEntity.ok("Major deleted successfully");
    }

    @GetMapping("/search")
    public ResponseEntity<List<Major>> searchMajors(@RequestParam(required = false) String keyword) {
        return ResponseEntity.ok(majorService.searchMajors(keyword));
    }

    @GetMapping("/page")
    public ResponseEntity<Page<Major>> getMajorPage(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size
    ) {
        return ResponseEntity.ok(majorService.getMajorsPage(page, size));
    }
}

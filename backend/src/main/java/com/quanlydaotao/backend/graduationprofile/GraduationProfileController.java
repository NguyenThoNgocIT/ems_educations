package com.quanlydaotao.backend.graduationprofile;

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
@RequestMapping("/api/v1/admin/graduation-profiles")
@RequiredArgsConstructor
@Tag(name = "graduation-profile-controller")
public class GraduationProfileController {

    private final GraduationProfileService profileService;

    @GetMapping
    public ResponseEntity<List<GraduationProfile>> getAllProfiles() {
        return ResponseEntity.ok(profileService.getAllProfiles());
    }

    @GetMapping("/{id}")
    public ResponseEntity<GraduationProfile> getProfileById(@PathVariable UUID id) {
        return ResponseEntity.ok(profileService.getProfileById(id));
    }

    @GetMapping("/search")
    public ResponseEntity<List<GraduationProfile>> searchProfiles(@RequestParam(required = false) String keyword) {
        return ResponseEntity.ok(profileService.searchProfiles(keyword));
    }

    @PostMapping
    public ResponseEntity<GraduationProfile> createProfile(@Valid @RequestBody GraduationProfileRequest request) {
        return ResponseEntity.ok(profileService.createProfile(request));
    }

    @PutMapping("/{id}")
    public ResponseEntity<GraduationProfile> updateProfile(@PathVariable UUID id, @Valid @RequestBody GraduationProfileRequest request) {
        return ResponseEntity.ok(profileService.updateProfile(id, request));
    }

    @PutMapping("/{id}/review")
    public ResponseEntity<GraduationProfile> reviewProfile(@PathVariable UUID id, @Valid @RequestBody GraduationProfileReviewRequest request) {
        return ResponseEntity.ok(profileService.reviewProfile(id, request));
    }

    @GetMapping("/student/{studentId}")
    public ResponseEntity<List<GraduationProfile>> getProfilesByStudent(@PathVariable UUID studentId) {
        return ResponseEntity.ok(profileService.getProfilesByStudent(studentId));
    }

    @GetMapping("/status/{status}")
    public ResponseEntity<List<GraduationProfile>> getProfilesByStatus(@PathVariable String status) {
        return ResponseEntity.ok(profileService.getProfilesByStatus(status));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteProfile(@PathVariable UUID id) {
        profileService.deleteProfile(id);
        return ResponseEntity.noContent().build();
    }
}

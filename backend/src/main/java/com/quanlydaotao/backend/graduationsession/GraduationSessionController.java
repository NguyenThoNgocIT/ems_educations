package com.quanlydaotao.backend.graduationsession;

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
@RequestMapping("/api/v1/admin/graduation-sessions")
@RequiredArgsConstructor
@Tag(name = "graduation-session-controller")
public class GraduationSessionController {

    private final GraduationSessionService sessionService;

    @GetMapping
    public ResponseEntity<List<GraduationSession>> getAllSessions() {
        return ResponseEntity.ok(sessionService.getAllSessions());
    }

    @GetMapping("/active")
    public ResponseEntity<List<GraduationSession>> getActiveSessions() {
        return ResponseEntity.ok(sessionService.getActiveSessions());
    }

    @GetMapping("/{id}")
    public ResponseEntity<GraduationSession> getSessionById(@PathVariable UUID id) {
        return ResponseEntity.ok(sessionService.getSessionById(id));
    }

    @GetMapping("/search")
    public ResponseEntity<List<GraduationSession>> searchSessions(@RequestParam(required = false) String keyword) {
        return ResponseEntity.ok(sessionService.searchSessions(keyword));
    }

    @PostMapping
    public ResponseEntity<GraduationSession> createSession(@Valid @RequestBody GraduationSessionRequest request) {
        return ResponseEntity.ok(sessionService.createSession(request));
    }

    @PutMapping("/{id}")
    public ResponseEntity<GraduationSession> updateSession(@PathVariable UUID id, @Valid @RequestBody GraduationSessionRequest request) {
        return ResponseEntity.ok(sessionService.updateSession(id, request));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteSession(@PathVariable UUID id) {
        sessionService.deleteSession(id);
        return ResponseEntity.noContent().build();
    }
}

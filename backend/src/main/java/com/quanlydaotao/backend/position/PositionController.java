package com.quanlydaotao.backend.position;

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
@RequestMapping("/api/v1/admin/positions")
@RequiredArgsConstructor
@PreAuthorize("hasRole('ADMIN')")
public class PositionController {

    private final PositionService positionService;

    @GetMapping
    public ResponseEntity<List<Position>> getAllPositions() {
        return ResponseEntity.ok(positionService.getAllPositions());
    }

    @GetMapping("/{id}")
    public ResponseEntity<Position> getPositionById(@PathVariable UUID id) {
        return ResponseEntity.ok(positionService.getPositionById(id));
    }

    @PostMapping
    public ResponseEntity<Position> createPosition(@Valid @RequestBody Position position) {
        return ResponseEntity.ok(positionService.createPosition(position));
    }

    @PutMapping("/{id}")
    public ResponseEntity<Position> updatePosition(
            @PathVariable UUID id,
            @Valid @RequestBody Position position
    ) {
        return ResponseEntity.ok(positionService.updatePosition(id, position));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<String> deletePosition(@PathVariable UUID id) {
        positionService.deletePosition(id);
        return ResponseEntity.ok("Position deleted successfully");
    }

    @GetMapping("/search")
    public ResponseEntity<List<Position>> searchPositions(@RequestParam(required = false) String keyword) {
        return ResponseEntity.ok(positionService.searchPositions(keyword));
    }
}

package com.quanlydaotao.backend.building;

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
@RequestMapping("/api/v1/admin/buildings")
@RequiredArgsConstructor
@Tag(name = "building-controller")
public class BuildingController {

    private final BuildingService buildingService;

    @GetMapping
    public ResponseEntity<List<Building>> getAllBuildings() {
        return ResponseEntity.ok(buildingService.getAllBuildings());
    }

    @GetMapping("/{id}")
    public ResponseEntity<Building> getBuildingById(@PathVariable UUID id) {
        return ResponseEntity.ok(buildingService.getBuildingById(id));
    }

    @PostMapping
    public ResponseEntity<Building> createBuilding(@Valid @RequestBody BuildingRequest request) {
        return ResponseEntity.ok(buildingService.createBuilding(request));
    }

    @PutMapping("/{id}")
    public ResponseEntity<Building> updateBuilding(@PathVariable UUID id, @Valid @RequestBody BuildingRequest request) {
        return ResponseEntity.ok(buildingService.updateBuilding(id, request));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteBuilding(@PathVariable UUID id) {
        buildingService.deleteBuilding(id);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/search")
    public ResponseEntity<List<Building>> searchBuildings(@RequestParam(required = false) String keyword) {
        return ResponseEntity.ok(buildingService.searchBuildings(keyword));
    }
}

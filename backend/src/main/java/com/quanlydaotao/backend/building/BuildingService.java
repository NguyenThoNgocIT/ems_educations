package com.quanlydaotao.backend.building;

import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class BuildingService {

    private final BuildingRepository buildingRepository;

    public List<Building> getAllBuildings() {
        return buildingRepository.findByIsActiveTrue();
    }

    public Building getBuildingById(UUID id) {
        return buildingRepository.findByIdAndIsActiveTrue(id)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy dữ liệu"));
    }

    public Building createBuilding(BuildingRequest request) {
        buildingRepository.findByBuildingCode(request.getBuildingCode())
                .ifPresent(existing -> {
                    throw new RuntimeException("Dữ liệu đã tồn tại");
                });
        Building building = Building.builder()
                .buildingCode(request.getBuildingCode())
                .buildingName(request.getBuildingName())
                .address(request.getAddress())
                .description(request.getDescription())
                .build();
        return buildingRepository.save(building);
    }

    public Building updateBuilding(UUID id, BuildingRequest request) {
        Building existing = getBuildingById(id);
        if (!existing.getBuildingCode().equals(request.getBuildingCode())) {
            buildingRepository.findByBuildingCode(request.getBuildingCode())
                    .ifPresent(conflict -> {
                        throw new RuntimeException("Dữ liệu đã tồn tại");
                    });
        }
        existing.setBuildingCode(request.getBuildingCode());
        existing.setBuildingName(request.getBuildingName());
        existing.setAddress(request.getAddress());
        existing.setDescription(request.getDescription());
        return buildingRepository.save(existing);
    }

    public void deleteBuilding(UUID id) {
        Building existing = getBuildingById(id);
        existing.setIsActive(false);
        existing.setDeletedAt(LocalDateTime.now());
        buildingRepository.save(existing);
    }

    public List<Building> searchBuildings(String keyword) {
        if (keyword == null || keyword.isBlank()) {
            return getAllBuildings();
        }
        return buildingRepository.findByBuildingNameContainingIgnoreCaseAndIsActiveTrue(keyword);
    }
}

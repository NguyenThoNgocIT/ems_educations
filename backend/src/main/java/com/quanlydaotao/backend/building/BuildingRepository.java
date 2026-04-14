package com.quanlydaotao.backend.building;

import java.util.List;
import java.util.Optional;
import java.util.UUID;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface BuildingRepository extends JpaRepository<Building, UUID> {

    Optional<Building> findByBuildingCode(String buildingCode);

    List<Building> findByBuildingNameContainingIgnoreCaseAndIsActiveTrue(String keyword);

    List<Building> findByIsActiveTrue();

    Optional<Building> findByIdAndIsActiveTrue(UUID id);
}

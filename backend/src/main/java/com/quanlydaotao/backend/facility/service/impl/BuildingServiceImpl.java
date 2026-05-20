package com.quanlydaotao.backend.facility.service.impl;

import com.quanlydaotao.backend.common.exception.ResourceNotFoundException;
import com.quanlydaotao.backend.facility.dto.BuildingDto;
import com.quanlydaotao.backend.facility.entity.Building;
import com.quanlydaotao.backend.facility.mapper.BuildingMapper;
import com.quanlydaotao.backend.facility.repository.BuildingRepository;
import com.quanlydaotao.backend.facility.service.BuildingService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class BuildingServiceImpl implements BuildingService {

    private final BuildingRepository buildingRepository;
    private final BuildingMapper buildingMapper;

    @Override
    public List<BuildingDto> getAll() {
        return buildingMapper.toDtoList(buildingRepository.findAll());
    }

    @Override
    public BuildingDto getById(UUID id) {
        Building building = buildingRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Không tìm thấy tòa nhà với ID: " + id));
        return buildingMapper.toDto(building);
    }

    @Override
    @Transactional
    public BuildingDto create(BuildingDto dto) {
        // Tạo entity thủ công để tránh lỗi mapper
        Building building = new Building();
        building.setCode(dto.getCode());
        building.setName(dto.getName());
        building.setAddress(dto.getAddress());
        building.setTotalFloors(dto.getTotalFloors());
        building.setBuildingType(dto.getBuildingType());
        building.setDescription(dto.getDescription());
        building.setNote(dto.getNote());
        
        Building saved = buildingRepository.save(building);
        return buildingMapper.toDto(saved);
    }

    @Override
    @Transactional
    public BuildingDto update(UUID id, BuildingDto dto) {
        Building building = buildingRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Không tìm thấy tòa nhà với ID: " + id));
        
        building.setCode(dto.getCode());
        building.setName(dto.getName());
        building.setAddress(dto.getAddress());
        building.setTotalFloors(dto.getTotalFloors());
        building.setBuildingType(dto.getBuildingType());
        building.setDescription(dto.getDescription());
        building.setNote(dto.getNote());
        
        return buildingMapper.toDto(buildingRepository.save(building));
    }

    @Override
    @Transactional
    public void delete(UUID id) {
        Building building = buildingRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Không tìm thấy tòa nhà với ID: " + id));
        buildingRepository.delete(building);
    }
}
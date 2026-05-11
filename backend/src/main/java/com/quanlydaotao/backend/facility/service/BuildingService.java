package com.quanlydaotao.backend.facility.service;

import com.quanlydaotao.backend.facility.dto.BuildingDto;
import java.util.List;
import java.util.UUID;

public interface BuildingService {
    List<BuildingDto> getAll();
    BuildingDto getById(UUID id);
    BuildingDto create(BuildingDto dto);
    BuildingDto update(UUID id, BuildingDto dto);
    void delete(UUID id);
}

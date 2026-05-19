package com.quanlydaotao.backend.position.service;

import com.quanlydaotao.backend.position.dto.PositionDto;

import java.util.List;
import java.util.UUID;

public interface PositionService {
    List<PositionDto> searchPositions(String keyword, UUID divisionId, Boolean isActive);

    PositionDto getPosition(UUID id);

    PositionDto createPosition(PositionDto request);

    PositionDto updatePosition(UUID id, PositionDto request);

    void deletePosition(UUID id);
}

package com.quanlydaotao.backend.degree.service;

import com.quanlydaotao.backend.degree.dto.DegreeDto;

import java.util.List;
import java.util.UUID;

public interface DegreeService {
    List<DegreeDto> searchDegrees(String keyword, UUID majorId, Boolean isActive);

    DegreeDto getDegree(UUID id);

    DegreeDto createDegree(DegreeDto request);

    DegreeDto updateDegree(UUID id, DegreeDto request);

    void deleteDegree(UUID id);
}

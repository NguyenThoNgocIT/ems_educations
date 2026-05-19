package com.quanlydaotao.backend.division.service;

import com.quanlydaotao.backend.division.dto.DivisionDto;

import java.util.List;
import java.util.UUID;

public interface DivisionService {
    List<DivisionDto> searchDivisions(String keyword, Boolean isActive);

    DivisionDto getDivision(UUID id);

    DivisionDto createDivision(DivisionDto request);

    DivisionDto updateDivision(UUID id, DivisionDto request);

    void deleteDivision(UUID id);
}

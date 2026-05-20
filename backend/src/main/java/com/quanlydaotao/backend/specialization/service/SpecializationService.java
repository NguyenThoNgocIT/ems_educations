package com.quanlydaotao.backend.specialization.service;

import com.quanlydaotao.backend.specialization.dto.SpecializationRequest;
import com.quanlydaotao.backend.specialization.dto.SpecializationResponse;

import java.util.List;
import java.util.UUID;

public interface SpecializationService {
    List<SpecializationResponse> search(String keyword, UUID departmentId, UUID majorId, Boolean isActive);

    SpecializationResponse getSpecialization(UUID id);

    SpecializationResponse createSpecialization(SpecializationRequest request);

    SpecializationResponse updateSpecialization(UUID id, SpecializationRequest request);

    void deleteSpecialization(UUID id);
}

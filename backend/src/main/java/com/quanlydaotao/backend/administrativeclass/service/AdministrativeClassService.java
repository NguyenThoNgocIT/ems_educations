package com.quanlydaotao.backend.administrativeclass.service;

import com.quanlydaotao.backend.administrativeclass.dto.AdministrativeClassRequest;
import com.quanlydaotao.backend.administrativeclass.dto.AdministrativeClassResponse;

import java.util.List;
import java.util.UUID;

public interface AdministrativeClassService {
    List<AdministrativeClassResponse> searchClasses(String keyword, UUID departmentId, UUID academicCohortId, Boolean isActive);

    AdministrativeClassResponse getClass(UUID id);

    AdministrativeClassResponse createClass(AdministrativeClassRequest request);

    AdministrativeClassResponse updateClass(UUID id, AdministrativeClassRequest request);

    void deleteClass(UUID id);
}

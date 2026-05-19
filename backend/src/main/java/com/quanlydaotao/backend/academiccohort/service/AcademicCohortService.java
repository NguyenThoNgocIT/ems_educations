package com.quanlydaotao.backend.academiccohort.service;

import com.quanlydaotao.backend.academiccohort.dto.AcademicCohortRequest;
import com.quanlydaotao.backend.academiccohort.dto.AcademicCohortResponse;

import java.util.List;
import java.util.UUID;

public interface AcademicCohortService {
    List<AcademicCohortResponse> searchCohorts(String keyword, Boolean isActive);

    AcademicCohortResponse getCohort(UUID id);

    AcademicCohortResponse createCohort(AcademicCohortRequest request);

    AcademicCohortResponse updateCohort(UUID id, AcademicCohortRequest request);

    void deleteCohort(UUID id);
}

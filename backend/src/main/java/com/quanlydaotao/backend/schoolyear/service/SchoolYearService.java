package com.quanlydaotao.backend.schoolyear.service;

import com.quanlydaotao.backend.schoolyear.dto.SchoolYearRequest;
import com.quanlydaotao.backend.schoolyear.dto.SchoolYearResponse;

import java.util.List;
import java.util.UUID;

public interface SchoolYearService {
    List<SchoolYearResponse> searchSchoolYears(String keyword, Boolean isActive);

    SchoolYearResponse getSchoolYear(UUID id);

    SchoolYearResponse createSchoolYear(SchoolYearRequest request);

    SchoolYearResponse updateSchoolYear(UUID id, SchoolYearRequest request);

    void deleteSchoolYear(UUID id);
}

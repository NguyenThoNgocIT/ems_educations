package com.quanlydaotao.backend.semester.service;

import com.quanlydaotao.backend.semester.dto.SemesterRequest;
import com.quanlydaotao.backend.semester.dto.SemesterResponse;

import java.util.List;
import java.util.UUID;

public interface SemesterService {
    List<SemesterResponse> searchSemesters(String keyword, UUID schoolYearId, Boolean status, Boolean isActive);

    SemesterResponse getSemester(UUID id);

    SemesterResponse createSemester(SemesterRequest request);

    SemesterResponse updateSemester(UUID id, SemesterRequest request);

    void deleteSemester(UUID id);
}

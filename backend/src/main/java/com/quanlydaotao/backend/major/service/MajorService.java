package com.quanlydaotao.backend.major.service;

import com.quanlydaotao.backend.major.dto.MajorRequest;
import com.quanlydaotao.backend.major.dto.MajorResponse;

import java.util.List;
import java.util.UUID;

public interface MajorService {
    List<MajorResponse> getAllMajors(String keyword, UUID departmentId, Boolean isActive);
    MajorResponse getMajorById(UUID id);
    MajorResponse createMajor(MajorRequest request);
    MajorResponse updateMajor(UUID id, MajorRequest request);
    void deleteMajor(UUID id);
}

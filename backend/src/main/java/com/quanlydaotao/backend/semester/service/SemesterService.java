package com.quanlydaotao.backend.semester.service;

import com.quanlydaotao.backend.semester.dto.request.CreateSemesterRequest;
import com.quanlydaotao.backend.semester.dto.request.SemesterSearchRequest;
import com.quanlydaotao.backend.semester.dto.request.UpdateSemesterRequest;
import com.quanlydaotao.backend.semester.dto.response.SemesterDetailResponse;
import com.quanlydaotao.backend.semester.dto.response.SemesterResponse;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

public interface SemesterService {
    
    SemesterResponse createSemester(CreateSemesterRequest request);
    
    SemesterResponse updateSemester(String semesterId, UpdateSemesterRequest request);
    
    SemesterDetailResponse getSemesterById(String semesterId);
    
    Page<SemesterResponse> searchSemesters(SemesterSearchRequest request, Pageable pageable);
    
    void deleteSemester(String semesterId);
    
    SemesterResponse activateSemester(String semesterId);
    
    SemesterDetailResponse getCurrentSemester();
    
    boolean isRegistrationOpen(String semesterId);
}
package com.quanlydaotao.backend.major.service;

import com.quanlydaotao.backend.major.dto.request.CreateMajorRequest;
import com.quanlydaotao.backend.major.dto.request.MajorSearchRequest;
import com.quanlydaotao.backend.major.dto.request.UpdateMajorRequest;
import com.quanlydaotao.backend.major.dto.response.MajorDetailResponse;
import com.quanlydaotao.backend.major.dto.response.MajorResponse;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import java.util.UUID;

public interface MajorService {
    
    MajorResponse createMajor(CreateMajorRequest request);
    
    MajorResponse updateMajor(UUID id, UpdateMajorRequest request);
    
    MajorDetailResponse getMajorById(UUID id);
    
    Page<MajorResponse> searchMajors(MajorSearchRequest request, Pageable pageable);
    
    void deleteMajor(UUID id);
}
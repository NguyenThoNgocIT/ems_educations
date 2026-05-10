package com.quanlydaotao.backend.major.service;

import com.quanlydaotao.backend.major.dto.request.CreateMajorRequest;
import com.quanlydaotao.backend.major.dto.request.MajorSearchRequest;
import com.quanlydaotao.backend.major.dto.request.UpdateMajorRequest;
import com.quanlydaotao.backend.major.dto.response.MajorDetailResponse;
import com.quanlydaotao.backend.major.dto.response.MajorResponse;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

public interface MajorService {
    
    MajorResponse createMajor(CreateMajorRequest request);
    
    MajorResponse updateMajor(String majorId, UpdateMajorRequest request);
    
    MajorDetailResponse getMajorById(String majorId);
    
    Page<MajorResponse> searchMajors(MajorSearchRequest request, Pageable pageable);
    
    void deleteMajor(String majorId);
}
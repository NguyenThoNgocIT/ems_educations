package com.quanlydaotao.backend.schoolyear.service;

import com.quanlydaotao.backend.schoolyear.dto.request.CreateSchoolYearRequest;
import com.quanlydaotao.backend.schoolyear.dto.request.SchoolYearSearchRequest;
import com.quanlydaotao.backend.schoolyear.dto.request.UpdateSchoolYearRequest;
import com.quanlydaotao.backend.schoolyear.dto.response.SchoolYearDetailResponse;
import com.quanlydaotao.backend.schoolyear.dto.response.SchoolYearResponse;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

public interface SchoolYearService {
    
    SchoolYearResponse createSchoolYear(CreateSchoolYearRequest request);
    
    SchoolYearResponse updateSchoolYear(String schoolYearId, UpdateSchoolYearRequest request);
    
    SchoolYearDetailResponse getSchoolYearById(String schoolYearId);
    
    Page<SchoolYearResponse> searchSchoolYears(SchoolYearSearchRequest request, Pageable pageable);
    
    void deleteSchoolYear(String schoolYearId);
    
    SchoolYearDetailResponse getCurrentSchoolYear();
    
    SchoolYearResponse setCurrentSchoolYear(String schoolYearId);
}
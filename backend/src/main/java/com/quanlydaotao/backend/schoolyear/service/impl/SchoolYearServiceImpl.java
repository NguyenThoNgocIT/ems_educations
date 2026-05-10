package com.quanlydaotao.backend.schoolyear.service.impl;

import com.quanlydaotao.backend.common.exception.BusinessException;
import com.quanlydaotao.backend.common.exception.ResourceNotFoundException;
import com.quanlydaotao.backend.schoolyear.dto.request.CreateSchoolYearRequest;
import com.quanlydaotao.backend.schoolyear.dto.request.SchoolYearSearchRequest;
import com.quanlydaotao.backend.schoolyear.dto.request.UpdateSchoolYearRequest;
import com.quanlydaotao.backend.schoolyear.dto.response.SchoolYearDetailResponse;
import com.quanlydaotao.backend.schoolyear.dto.response.SchoolYearResponse;
import com.quanlydaotao.backend.schoolyear.entity.SchoolYear;
import com.quanlydaotao.backend.schoolyear.mapper.SchoolYearMapper;
import com.quanlydaotao.backend.schoolyear.repository.SchoolYearRepository;
import com.quanlydaotao.backend.schoolyear.service.SchoolYearService;
import com.quanlydaotao.backend.schoolyear.spec.SchoolYearSpecification;
import com.quanlydaotao.backend.schoolyear.validator.SchoolYearValidator;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.temporal.ChronoUnit;

@Service
@RequiredArgsConstructor
public class SchoolYearServiceImpl implements SchoolYearService {
    
    private final SchoolYearRepository schoolYearRepository;
    private final SchoolYearMapper schoolYearMapper;
    private final SchoolYearValidator schoolYearValidator;
    
    @Override
    @Transactional
    public SchoolYearResponse createSchoolYear(CreateSchoolYearRequest request) {
        schoolYearValidator.validateCreateSchoolYear(request);
        
        SchoolYear schoolYear = schoolYearMapper.toEntity(request);
        schoolYear = schoolYearRepository.save(schoolYear);
        
        return schoolYearMapper.toResponse(schoolYear);
    }
    
    @Override
    @Transactional
    public SchoolYearResponse updateSchoolYear(String schoolYearId, UpdateSchoolYearRequest request) {
        SchoolYear schoolYear = schoolYearRepository.findActiveById(schoolYearId)
            .orElseThrow(() -> new ResourceNotFoundException("Không tìm thấy năm học với ID: " + schoolYearId));
        
        schoolYearValidator.validateUpdateSchoolYear(schoolYear, request);
        schoolYearMapper.updateEntity(request, schoolYear);
        
        schoolYear = schoolYearRepository.save(schoolYear);
        return schoolYearMapper.toResponse(schoolYear);
    }
    
    @Override
    @Transactional(readOnly = true)
    public SchoolYearDetailResponse getSchoolYearById(String schoolYearId) {
        SchoolYear schoolYear = schoolYearRepository.findActiveById(schoolYearId)
            .orElseThrow(() -> new ResourceNotFoundException("Không tìm thấy năm học với ID: " + schoolYearId));
        
        SchoolYearDetailResponse response = schoolYearMapper.toDetailResponse(schoolYear);
        
        // Tính toán thêm
        LocalDate today = LocalDate.now();
        if (schoolYear.getEndDate() != null && today.isBefore(schoolYear.getEndDate())) {
            response.setDaysRemaining(ChronoUnit.DAYS.between(today, schoolYear.getEndDate()));
        } else {
            response.setDaysRemaining(0L);
        }
        
        response.setIsCurrent(today.isAfter(schoolYear.getStartDate()) && today.isBefore(schoolYear.getEndDate()));
        
        return response;
    }
    
    @Override
    @Transactional(readOnly = true)
    public Page<SchoolYearResponse> searchSchoolYears(SchoolYearSearchRequest request, Pageable pageable) {
        var spec = SchoolYearSpecification.filterByCriteria(request);
        Page<SchoolYear> schoolYears = schoolYearRepository.findAll(spec, pageable);
        return schoolYears.map(schoolYearMapper::toResponse);
    }
    
    @Override
    @Transactional
    public void deleteSchoolYear(String schoolYearId) {
        SchoolYear schoolYear = schoolYearRepository.findActiveById(schoolYearId)
            .orElseThrow(() -> new ResourceNotFoundException("Không tìm thấy năm học với ID: " + schoolYearId));
        
        schoolYearValidator.validateBeforeDelete(schoolYear);
        
        schoolYear.setDeletedAt(LocalDateTime.now());
        schoolYear.setIsActive(false);
        schoolYearRepository.save(schoolYear);
    }
    
    @Override
    @Transactional(readOnly = true)
    public SchoolYearDetailResponse getCurrentSchoolYear() {
        LocalDate today = LocalDate.now();
        SchoolYear schoolYear = schoolYearRepository.findCurrentSchoolYear(today)
            .orElseThrow(() -> new ResourceNotFoundException("Không tìm thấy năm học đang diễn ra"));
        
        return getSchoolYearById(schoolYear.getSchoolYearId());
    }
    
    @Override
    @Transactional
    public SchoolYearResponse setCurrentSchoolYear(String schoolYearId) {
        SchoolYear schoolYear = schoolYearRepository.findActiveById(schoolYearId)
            .orElseThrow(() -> new ResourceNotFoundException("Không tìm thấy năm học với ID: " + schoolYearId));
        
        // Bỏ chọn all
        schoolYearRepository.findAllActiveOrderByStartDateDesc().forEach(sy -> {
            sy.setIsActive(false);
            schoolYearRepository.save(sy);
        });
        
        schoolYear.setIsActive(true);
        schoolYear = schoolYearRepository.save(schoolYear);
        
        return schoolYearMapper.toResponse(schoolYear);
    }
}
package com.quanlydaotao.backend.semester.service.impl;

import com.quanlydaotao.backend.common.exception.BusinessException;
import com.quanlydaotao.backend.common.exception.ResourceNotFoundException;
import com.quanlydaotao.backend.schoolyear.entity.SchoolYear;
import com.quanlydaotao.backend.schoolyear.repository.SchoolYearRepository;
import com.quanlydaotao.backend.semester.dto.request.CreateSemesterRequest;
import com.quanlydaotao.backend.semester.dto.request.SemesterSearchRequest;
import com.quanlydaotao.backend.semester.dto.request.UpdateSemesterRequest;
import com.quanlydaotao.backend.semester.dto.response.SemesterDetailResponse;
import com.quanlydaotao.backend.semester.dto.response.SemesterResponse;
import com.quanlydaotao.backend.semester.entity.Semester;
import com.quanlydaotao.backend.semester.mapper.SemesterMapper;
import com.quanlydaotao.backend.semester.repository.SemesterRepository;
import com.quanlydaotao.backend.semester.service.SemesterService;
import com.quanlydaotao.backend.semester.spec.SemesterSpecification;
import com.quanlydaotao.backend.semester.validator.SemesterValidator;
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
public class SemesterServiceImpl implements SemesterService {
    
    private final SemesterRepository semesterRepository;
    private final SchoolYearRepository schoolYearRepository;
    private final SemesterMapper semesterMapper;
    private final SemesterValidator semesterValidator;
    
    @Override
    @Transactional
    public SemesterResponse createSemester(CreateSemesterRequest request) {
        semesterValidator.validateCreateSemester(request);
        
        SchoolYear schoolYear = schoolYearRepository.findActiveById(request.getSchoolYearId())
            .orElseThrow(() -> new ResourceNotFoundException("Không tìm thấy năm học với ID: " + request.getSchoolYearId()));
        
        Semester semester = semesterMapper.toEntity(request);
        semester.setSchoolYear(schoolYear);
        semester = semesterRepository.save(semester);
        
        return semesterMapper.toResponse(semester);
    }
    
    @Override
    @Transactional
    public SemesterResponse updateSemester(String semesterId, UpdateSemesterRequest request) {
        Semester semester = semesterRepository.findActiveById(semesterId)
            .orElseThrow(() -> new ResourceNotFoundException("Không tìm thấy học kỳ với ID: " + semesterId));
        
        semesterValidator.validateUpdateSemester(semester, request);
        
        semesterMapper.updateEntity(request, semester);
        
        if (request.getSchoolYearId() != null && !request.getSchoolYearId().isEmpty()) {
            SchoolYear schoolYear = schoolYearRepository.findActiveById(request.getSchoolYearId())
                .orElseThrow(() -> new ResourceNotFoundException("Không tìm thấy năm học với ID: " + request.getSchoolYearId()));
            semester.setSchoolYear(schoolYear);
        }
        
        semester = semesterRepository.save(semester);
        return semesterMapper.toResponse(semester);
    }
    
    @Override
    @Transactional(readOnly = true)
    public SemesterDetailResponse getSemesterById(String semesterId) {
        Semester semester = semesterRepository.findActiveById(semesterId)
            .orElseThrow(() -> new ResourceNotFoundException("Không tìm thấy học kỳ với ID: " + semesterId));
        
        SemesterDetailResponse response = semesterMapper.toDetailResponse(semester);
        
        // Tính toán thêm thông tin
        LocalDate today = LocalDate.now();
        if (semester.getEndDate() != null && today.isBefore(semester.getEndDate())) {
            response.setDaysRemaining(ChronoUnit.DAYS.between(today, semester.getEndDate()));
        } else {
            response.setDaysRemaining(0L);
        }
        
        response.setIsRegistrationOpen(isRegistrationOpen(semesterId));
        
        return response;
    }
    
    @Override
    @Transactional(readOnly = true)
    public Page<SemesterResponse> searchSemesters(SemesterSearchRequest request, Pageable pageable) {
        var spec = SemesterSpecification.filterByCriteria(request);
        Page<Semester> semesters = semesterRepository.findAll(spec, pageable);
        return semesters.map(semesterMapper::toResponse);
    }
    
    @Override
    @Transactional
    public void deleteSemester(String semesterId) {
        Semester semester = semesterRepository.findActiveById(semesterId)
            .orElseThrow(() -> new ResourceNotFoundException("Không tìm thấy học kỳ với ID: " + semesterId));
        
        semesterValidator.validateBeforeDelete(semester);
        
        semester.setDeletedAt(LocalDateTime.now());  // Dòng này đã đúng
        semester.setIsActive(false);
        semesterRepository.save(semester);
    }
    
    @Override
    @Transactional
    public SemesterResponse activateSemester(String semesterId) {
        Semester semester = semesterRepository.findActiveById(semesterId)
            .orElseThrow(() -> new ResourceNotFoundException("Không tìm thấy học kỳ với ID: " + semesterId));
        
        // Deactivate current active semester
        semesterRepository.findActiveSemester().ifPresent(active -> {
            active.setIsActive(false);
            semesterRepository.save(active);
        });
        
        semester.setIsActive(true);
        semester = semesterRepository.save(semester);
        
        return semesterMapper.toResponse(semester);
    }
    
    @Override
    @Transactional(readOnly = true)
    public SemesterDetailResponse getCurrentSemester() {
        LocalDate today = LocalDate.now();
        Semester semester = semesterRepository.findCurrentSemester(today)
            .orElseThrow(() -> new ResourceNotFoundException("Không tìm thấy học kỳ đang diễn ra"));
        
        return getSemesterById(semester.getSemesterId());
    }
    
    @Override
    @Transactional(readOnly = true)
    public boolean isRegistrationOpen(String semesterId) {
        Semester semester = semesterRepository.findActiveById(semesterId)
            .orElseThrow(() -> new ResourceNotFoundException("Không tìm thấy học kỳ với ID: " + semesterId));
        
        // Logic kiểm tra thời gian đăng ký (có thể thêm bảng registration_periods sau)
        return semester.getIsActive() && semester.getStartDate() != null;
    }
}
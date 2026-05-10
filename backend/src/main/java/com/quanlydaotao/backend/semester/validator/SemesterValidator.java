package com.quanlydaotao.backend.semester.validator;

import com.quanlydaotao.backend.common.exception.BusinessException;
import com.quanlydaotao.backend.semester.dto.request.CreateSemesterRequest;
import com.quanlydaotao.backend.semester.dto.request.UpdateSemesterRequest;
import com.quanlydaotao.backend.semester.entity.Semester;
import com.quanlydaotao.backend.semester.repository.SemesterRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;

import java.time.LocalDate;
import java.time.temporal.ChronoUnit;

@Component
@RequiredArgsConstructor
public class SemesterValidator {
    
    private final SemesterRepository semesterRepository;
    
    public void validateCreateSemester(CreateSemesterRequest request) {
        // 1. Kiểm tra mã học kỳ không trùng
        if (semesterRepository.existsByCodeAndDeletedAtIsNull(request.getCode())) {
            throw new BusinessException("Mã học kỳ đã tồn tại: " + request.getCode());
        }
        
        // 2. Ngày kết thúc phải sau ngày bắt đầu
        if (request.getEndDate().isBefore(request.getStartDate())) {
            throw new BusinessException("Ngày kết thúc phải sau ngày bắt đầu");
        }
        
        // 3. Học kỳ không kéo dài quá 180 ngày
        long daysBetween = ChronoUnit.DAYS.between(request.getStartDate(), request.getEndDate());
        if (daysBetween > 180) {
            throw new BusinessException("Học kỳ không thể kéo dài quá 180 ngày");
        }
        
        // 4. Kiểm tra năm học tồn tại (sẽ được service kiểm tra)
    }
    
    public void validateUpdateSemester(Semester existingSemester, UpdateSemesterRequest request) {
        // Kiểm tra mã mới không trùng với học kỳ khác
        if (request.getCode() != null && !request.getCode().equals(existingSemester.getCode())) {
            if (semesterRepository.existsByCodeAndDeletedAtIsNull(request.getCode())) {
                throw new BusinessException("Mã học kỳ đã tồn tại: " + request.getCode());
            }
        }
        
        // Kiểm tra ngày tháng
        LocalDate startDate = request.getStartDate() != null ? request.getStartDate() : existingSemester.getStartDate();
        LocalDate endDate = request.getEndDate() != null ? request.getEndDate() : existingSemester.getEndDate();
        
        if (endDate.isBefore(startDate)) {
            throw new BusinessException("Ngày kết thúc phải sau ngày bắt đầu");
        }
    }
    
    public void validateBeforeDelete(Semester semester) {
        // TODO: Kiểm tra ràng buộc với các bảng khác
        // - Có CourseClasses không?
        // - Có CourseRegistrations không?
        // - Có Grades không?
        
        if (semester.getStatus() == 1) {
            throw new BusinessException("Không thể xóa học kỳ đang diễn ra");
        }
    }
}
package com.quanlydaotao.backend.schoolyear.validator;

import com.quanlydaotao.backend.common.exception.BusinessException;
import com.quanlydaotao.backend.schoolyear.dto.request.CreateSchoolYearRequest;
import com.quanlydaotao.backend.schoolyear.dto.request.UpdateSchoolYearRequest;
import com.quanlydaotao.backend.schoolyear.entity.SchoolYear;
import com.quanlydaotao.backend.schoolyear.repository.SchoolYearRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;

import java.time.LocalDate;
import java.time.temporal.ChronoUnit;

@Component
@RequiredArgsConstructor
public class SchoolYearValidator {
    
    private final SchoolYearRepository schoolYearRepository;
    
    public void validateCreateSchoolYear(CreateSchoolYearRequest request) {
        // 1. Kiểm tra mã năm học không trùng
        if (schoolYearRepository.existsByCodeAndDeletedAtIsNull(request.getCode())) {
            throw new BusinessException("Mã năm học đã tồn tại: " + request.getCode());
        }
        
        // 2. Ngày kết thúc phải sau ngày bắt đầu
        if (request.getEndDate().isBefore(request.getStartDate())) {
            throw new BusinessException("Ngày kết thúc phải sau ngày bắt đầu");
        }
        
        // 3. Năm học không quá 365 ngày
        long daysBetween = ChronoUnit.DAYS.between(request.getStartDate(), request.getEndDate());
        if (daysBetween > 365) {
            throw new BusinessException("Năm học không thể kéo dài quá 365 ngày");
        }
        
        // 4. Format code phải đúng (yyyy-yyyy)
        String codePattern = "^\\d{4}-\\d{4}$";
        if (!request.getCode().matches(codePattern)) {
            throw new BusinessException("Mã năm học phải có định dạng: YYYY-YYYY (ví dụ: 2024-2025)");
        }
    }
    
    public void validateUpdateSchoolYear(SchoolYear existingSchoolYear, UpdateSchoolYearRequest request) {
        // Kiểm tra mã mới không trùng
        if (request.getCode() != null && !request.getCode().equals(existingSchoolYear.getCode())) {
            if (schoolYearRepository.existsByCodeAndDeletedAtIsNull(request.getCode())) {
                throw new BusinessException("Mã năm học đã tồn tại: " + request.getCode());
            }
        }
        
        // Kiểm tra ngày tháng
        LocalDate startDate = request.getStartDate() != null ? request.getStartDate() : existingSchoolYear.getStartDate();
        LocalDate endDate = request.getEndDate() != null ? request.getEndDate() : existingSchoolYear.getEndDate();
        
        if (endDate.isBefore(startDate)) {
            throw new BusinessException("Ngày kết thúc phải sau ngày bắt đầu");
        }
    }
    
    public void validateBeforeDelete(SchoolYear schoolYear) {
        // TODO: Kiểm tra có Semester nào thuộc năm học này không
        // if (semesterRepository.existsBySchoolYearId(schoolYear.getSchoolYearId())) {
        //     throw new BusinessException("Không thể xóa năm học đã có học kỳ");
        // }
    }
}
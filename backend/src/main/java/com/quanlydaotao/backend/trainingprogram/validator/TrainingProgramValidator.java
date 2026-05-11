package com.quanlydaotao.backend.trainingprogram.validator;

import com.quanlydaotao.backend.common.exception.BusinessException;
import com.quanlydaotao.backend.trainingprogram.dto.request.CreateTrainingProgramRequest;
import com.quanlydaotao.backend.trainingprogram.dto.request.UpdateTrainingProgramRequest;
import com.quanlydaotao.backend.trainingprogram.entity.TrainingProgram;
import com.quanlydaotao.backend.trainingprogram.repository.TrainingProgramRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;

import java.time.LocalDate;

@Component
@RequiredArgsConstructor
public class TrainingProgramValidator {

    private final TrainingProgramRepository trainingProgramRepository;

    public void validateCreateTrainingProgram(CreateTrainingProgramRequest request) {
        if (trainingProgramRepository.existsByCode(request.getCode())) {
            throw new BusinessException("Mã chương trình đào tạo đã tồn tại: " + request.getCode());
        }
        
        // Kiểm tra effective_date <= expiry_date
        if (request.getEffectiveDate() != null && request.getExpiryDate() != null) {
            if (request.getEffectiveDate().isAfter(request.getExpiryDate())) {
                throw new BusinessException("Ngày hiệu lực phải trước hoặc bằng ngày hết hạn");
            }
        }
        
        // Kiểm tra duration_years > 0
        if (request.getDurationYears() != null && request.getDurationYears().compareTo(java.math.BigDecimal.ZERO) <= 0) {
            throw new BusinessException("Thời gian đào tạo phải lớn hơn 0");
        }
    }

    public void validateUpdateTrainingProgram(TrainingProgram existingTrainingProgram, UpdateTrainingProgramRequest request) {
        if (request.getCode() != null && !request.getCode().equals(existingTrainingProgram.getCode())) {
            if (trainingProgramRepository.existsByCode(request.getCode())) {
                throw new BusinessException("Mã chương trình đào tạo đã tồn tại: " + request.getCode());
            }
        }
        
        // Kiểm tra effective_date <= expiry_date
        LocalDate effectiveDate = request.getEffectiveDate() != null ? request.getEffectiveDate() : existingTrainingProgram.getEffectiveDate();
        LocalDate expiryDate = request.getExpiryDate() != null ? request.getExpiryDate() : existingTrainingProgram.getExpiryDate();
        
        if (effectiveDate != null && expiryDate != null && effectiveDate.isAfter(expiryDate)) {
            throw new BusinessException("Ngày hiệu lực phải trước hoặc bằng ngày hết hạn");
        }
    }

    public void validateBeforeDelete(TrainingProgram trainingProgram) {
        // TODO: Kiểm tra xem có CourseRegistrations nào thuộc chương trình này không
    }
}
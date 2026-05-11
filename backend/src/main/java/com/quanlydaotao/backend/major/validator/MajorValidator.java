package com.quanlydaotao.backend.major.validator;

import com.quanlydaotao.backend.common.exception.BusinessException;
import com.quanlydaotao.backend.major.dto.request.CreateMajorRequest;
import com.quanlydaotao.backend.major.dto.request.UpdateMajorRequest;
import com.quanlydaotao.backend.major.entity.Major;
import com.quanlydaotao.backend.major.repository.MajorRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
public class MajorValidator {

    private final MajorRepository majorRepository;

    public void validateCreateMajor(CreateMajorRequest request) {
        if (majorRepository.existsByCode(request.getCode())) {
            throw new BusinessException("Mã chuyên ngành đã tồn tại: " + request.getCode());
        }
    }

    public void validateUpdateMajor(Major existingMajor, UpdateMajorRequest request) {
        if (request.getCode() != null && !request.getCode().equals(existingMajor.getCode())) {
            if (majorRepository.existsByCode(request.getCode())) {
                throw new BusinessException("Mã chuyên ngành đã tồn tại: " + request.getCode());
            }
        }
    }

    public void validateBeforeDelete(Major major) {
        // TODO: Kiểm tra xem có TrainingPrograms nào thuộc chuyên ngành này không
    }
}
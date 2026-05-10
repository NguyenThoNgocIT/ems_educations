package com.quanlydaotao.backend.classmanagement.validator;

import com.quanlydaotao.backend.common.exception.BusinessException;
import com.quanlydaotao.backend.classmanagement.dto.request.CreateClassRequest;
import com.quanlydaotao.backend.classmanagement.dto.request.UpdateClassRequest;
import com.quanlydaotao.backend.classmanagement.entity.Class;
import com.quanlydaotao.backend.classmanagement.repository.ClassRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
public class ClassValidator {

    private final ClassRepository classRepository;

    public void validateCreateClass(CreateClassRequest request) {
        if (classRepository.existsByClassCode(request.getClassCode())) {
            throw new BusinessException("Mã lớp đã tồn tại: " + request.getClassCode());
        }
        
        if (request.getMaxSize() != null && request.getMaxSize() <= 0) {
            throw new BusinessException("Sĩ số lớp phải lớn hơn 0");
        }
    }

    public void validateUpdateClass(Class existingClass, UpdateClassRequest request) {
        if (request.getClassCode() != null && !request.getClassCode().equals(existingClass.getClassCode())) {
            if (classRepository.existsByClassCode(request.getClassCode())) {
                throw new BusinessException("Mã lớp đã tồn tại: " + request.getClassCode());
            }
        }
        
        if (request.getMaxSize() != null && request.getMaxSize() <= 0) {
            throw new BusinessException("Sĩ số lớp phải lớn hơn 0");
        }
    }

    public void validateBeforeDelete(Class classEntity) {
        // TODO: Kiểm tra xem có StudentClasses nào thuộc lớp này không
    }
}
package com.quanlydaotao.backend.department.validator;

import com.quanlydaotao.backend.common.exception.BusinessException;
import com.quanlydaotao.backend.department.dto.request.CreateDepartmentRequest;
import com.quanlydaotao.backend.department.dto.request.UpdateDepartmentRequest;
import com.quanlydaotao.backend.department.entity.Department;
import com.quanlydaotao.backend.department.repository.DepartmentRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
public class DepartmentValidator {

    private final DepartmentRepository departmentRepository;

    public void validateCreateDepartment(CreateDepartmentRequest request) {
        if (departmentRepository.existsByCode(request.getCode())) {
            throw new BusinessException("Mã khoa đã tồn tại: " + request.getCode());
        }
    }

    public void validateUpdateDepartment(Department existingDepartment, UpdateDepartmentRequest request) {
        if (request.getCode() != null && !request.getCode().equals(existingDepartment.getCode())) {
            if (departmentRepository.existsByCode(request.getCode())) {
                throw new BusinessException("Mã khoa đã tồn tại: " + request.getCode());
            }
        }
    }

    public void validateBeforeDelete(Department department) {
        // TODO: Kiểm tra xem có Courses, Majors, Lecturers nào thuộc khoa này không
    }
}
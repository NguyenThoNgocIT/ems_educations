package com.quanlydaotao.backend.registration.validator;

import com.quanlydaotao.backend.common.exception.BusinessException;
import com.quanlydaotao.backend.registration.dto.request.CreateRegistrationRequest;
import com.quanlydaotao.backend.registration.entity.CourseRegistration;
import com.quanlydaotao.backend.registration.repository.CourseRegistrationRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
public class RegistrationValidator {

    private final CourseRegistrationRepository registrationRepository;

    public void validateCreateRegistration(CreateRegistrationRequest request) {
        // Kiểm tra đã đăng ký lớp này chưa (chưa hủy)
        if (registrationRepository.existsByStudentIdAndCourseClassIdAndStatusNot(
                request.getStudentId(), request.getCourseClassId(), 2)) {
            throw new BusinessException("Sinh viên đã đăng ký lớp học phần này rồi");
        }
        
        // Kiểm tra registration_type hợp lệ
        if (request.getRegistrationType() != null) {
            if (request.getRegistrationType() < 0 || request.getRegistrationType() > 2) {
                throw new BusinessException("Loại đăng ký không hợp lệ (0: Bình thường, 1: Học lại, 2: Cải thiện)");
            }
        }
    }

    public void validateBeforeDelete(CourseRegistration registration) {
        if (registration.getStatus() == 1) {
            throw new BusinessException("Không thể xóa đăng ký đã được xác nhận");
        }
    }
}
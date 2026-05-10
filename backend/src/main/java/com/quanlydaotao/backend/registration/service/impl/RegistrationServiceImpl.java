package com.quanlydaotao.backend.registration.service.impl;

import com.quanlydaotao.backend.common.exception.BusinessException;
import com.quanlydaotao.backend.common.exception.ResourceNotFoundException;
import com.quanlydaotao.backend.registration.dto.request.CreateRegistrationRequest;
import com.quanlydaotao.backend.registration.dto.request.RegistrationSearchRequest;
import com.quanlydaotao.backend.registration.dto.request.UpdateRegistrationRequest;
import com.quanlydaotao.backend.registration.dto.response.RegistrationDetailResponse;
import com.quanlydaotao.backend.registration.dto.response.RegistrationResponse;
import com.quanlydaotao.backend.registration.entity.CourseRegistration;
import com.quanlydaotao.backend.registration.mapper.RegistrationMapper;
import com.quanlydaotao.backend.registration.repository.CourseRegistrationRepository;
import com.quanlydaotao.backend.registration.service.RegistrationService;
import com.quanlydaotao.backend.registration.spec.RegistrationSpecification;
import com.quanlydaotao.backend.registration.validator.RegistrationValidator;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class RegistrationServiceImpl implements RegistrationService {

    private final CourseRegistrationRepository registrationRepository;
    private final RegistrationMapper registrationMapper;
    private final RegistrationValidator registrationValidator;

    @Override
    @Transactional
    public RegistrationResponse createRegistration(CreateRegistrationRequest request) {
        registrationValidator.validateCreateRegistration(request);
        
        CourseRegistration registration = registrationMapper.toEntity(request);
        registration.setStatus(0);
        registration.setIsPaid(false);
        registration.setRegisteredAt(LocalDateTime.now());
        registration = registrationRepository.save(registration);
        
        return registrationMapper.toResponse(registration);
    }

    @Override
    @Transactional
    public RegistrationResponse updateRegistration(UUID id, UpdateRegistrationRequest request) {
        CourseRegistration registration = registrationRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Không tìm thấy đăng ký với ID: " + id));
        
        registrationMapper.updateEntity(request, registration);
        registration = registrationRepository.save(registration);
        
        return registrationMapper.toResponse(registration);
    }

    @Override
    @Transactional(readOnly = true)
    public RegistrationDetailResponse getRegistrationById(UUID id) {
        CourseRegistration registration = registrationRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Không tìm thấy đăng ký với ID: " + id));
        
        return registrationMapper.toDetailResponse(registration);
    }

    @Override
    @Transactional(readOnly = true)
    public Page<RegistrationResponse> searchRegistrations(RegistrationSearchRequest request, Pageable pageable) {
        var spec = RegistrationSpecification.filterByCriteria(request);
        Page<CourseRegistration> registrations = registrationRepository.findAll(spec, pageable);
        return registrations.map(registrationMapper::toResponse);
    }

    @Override
    @Transactional(readOnly = true)
    public Page<RegistrationResponse> getRegistrationsByStudent(UUID studentId, Pageable pageable) {
        Page<CourseRegistration> registrations = registrationRepository.findByStudentId(studentId, pageable);
        return registrations.map(registrationMapper::toResponse);
    }

    @Override
    @Transactional
    public RegistrationResponse cancelRegistration(UUID id) {
        CourseRegistration registration = registrationRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Không tìm thấy đăng ký với ID: " + id));
        
        if (registration.getStatus() == 1) {
            throw new BusinessException("Không thể hủy đăng ký đã được xác nhận");
        }
        
        registration.setStatus(2);
        registration = registrationRepository.save(registration);
        
        return registrationMapper.toResponse(registration);
    }

    @Override
    @Transactional
    public RegistrationResponse confirmRegistration(UUID id) {
        CourseRegistration registration = registrationRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Không tìm thấy đăng ký với ID: " + id));
        
        registration.setStatus(1);
        registration = registrationRepository.save(registration);
        
        return registrationMapper.toResponse(registration);
    }

    @Override
    @Transactional
    public void deleteRegistration(UUID id) {
        CourseRegistration registration = registrationRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Không tìm thấy đăng ký với ID: " + id));
        
        registration.setDeletedAt(LocalDateTime.now());
        registration.setIsActive(false);
        registrationRepository.save(registration);
    }
}
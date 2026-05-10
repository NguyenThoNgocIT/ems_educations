package com.quanlydaotao.backend.registration.service;

import com.quanlydaotao.backend.registration.dto.request.CreateRegistrationRequest;
import com.quanlydaotao.backend.registration.dto.request.RegistrationSearchRequest;
import com.quanlydaotao.backend.registration.dto.request.UpdateRegistrationRequest;
import com.quanlydaotao.backend.registration.dto.response.RegistrationDetailResponse;
import com.quanlydaotao.backend.registration.dto.response.RegistrationResponse;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import java.util.UUID;

public interface RegistrationService {
    
    RegistrationResponse createRegistration(CreateRegistrationRequest request);
    
    RegistrationResponse updateRegistration(UUID id, UpdateRegistrationRequest request);
    
    RegistrationDetailResponse getRegistrationById(UUID id);
    
    Page<RegistrationResponse> searchRegistrations(RegistrationSearchRequest request, Pageable pageable);
    
    Page<RegistrationResponse> getRegistrationsByStudent(UUID studentId, Pageable pageable);
    
    RegistrationResponse cancelRegistration(UUID id);
    
    RegistrationResponse confirmRegistration(UUID id);
    
    void deleteRegistration(UUID id);
}
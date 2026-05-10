package com.quanlydaotao.backend.major.service.impl;

import com.quanlydaotao.backend.common.exception.ResourceNotFoundException;
import com.quanlydaotao.backend.major.dto.request.CreateMajorRequest;
import com.quanlydaotao.backend.major.dto.request.MajorSearchRequest;
import com.quanlydaotao.backend.major.dto.request.UpdateMajorRequest;
import com.quanlydaotao.backend.major.dto.response.MajorDetailResponse;
import com.quanlydaotao.backend.major.dto.response.MajorResponse;
import com.quanlydaotao.backend.major.entity.Major;
import com.quanlydaotao.backend.major.mapper.MajorMapper;
import com.quanlydaotao.backend.major.repository.MajorRepository;
import com.quanlydaotao.backend.major.service.MajorService;
import com.quanlydaotao.backend.major.spec.MajorSpecification;
import com.quanlydaotao.backend.major.validator.MajorValidator;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class MajorServiceImpl implements MajorService {

    private final MajorRepository majorRepository;
    private final MajorMapper majorMapper;
    private final MajorValidator majorValidator;

    @Override
    @Transactional
    public MajorResponse createMajor(CreateMajorRequest request) {
        majorValidator.validateCreateMajor(request);
        
        Major major = majorMapper.toEntity(request);
        major = majorRepository.save(major);
        
        return majorMapper.toResponse(major);
    }

    @Override
    @Transactional
    public MajorResponse updateMajor(String majorId, UpdateMajorRequest request) {
        Major major = majorRepository.findById(UUID.fromString(majorId))
                .orElseThrow(() -> new ResourceNotFoundException("Không tìm thấy chuyên ngành với ID: " + majorId));
        
        majorValidator.validateUpdateMajor(major, request);
        majorMapper.updateEntity(request, major);
        
        major = majorRepository.save(major);
        return majorMapper.toResponse(major);
    }

    @Override
    @Transactional(readOnly = true)
    public MajorDetailResponse getMajorById(String majorId) {
        Major major = majorRepository.findById(UUID.fromString(majorId))
                .orElseThrow(() -> new ResourceNotFoundException("Không tìm thấy chuyên ngành với ID: " + majorId));
        
        return majorMapper.toDetailResponse(major);
    }

    @Override
    @Transactional(readOnly = true)
    public Page<MajorResponse> searchMajors(MajorSearchRequest request, Pageable pageable) {
        var spec = MajorSpecification.filterByCriteria(request);
        Page<Major> majors = majorRepository.findAll(spec, pageable);
        return majors.map(majorMapper::toResponse);
    }

    @Override
    @Transactional
    public void deleteMajor(String majorId) {
        Major major = majorRepository.findById(UUID.fromString(majorId))
                .orElseThrow(() -> new ResourceNotFoundException("Không tìm thấy chuyên ngành với ID: " + majorId));
        
        majorValidator.validateBeforeDelete(major);
        
        major.setDeletedAt(LocalDateTime.now());
        major.setIsActive(false);
        majorRepository.save(major);
    }
}
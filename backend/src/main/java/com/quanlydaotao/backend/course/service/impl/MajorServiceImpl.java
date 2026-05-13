package com.quanlydaotao.backend.course.service.impl;

import com.quanlydaotao.backend.course.dto.CreateMajorRequest;
import com.quanlydaotao.backend.course.dto.MajorDto;
import com.quanlydaotao.backend.course.entity.Major;
import com.quanlydaotao.backend.course.repository.MajorRepository;
import com.quanlydaotao.backend.course.service.MajorService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.UUID;

@Service
@RequiredArgsConstructor
public class MajorServiceImpl implements MajorService {

    private final MajorRepository majorRepository;

    @Override
    @Transactional(readOnly = true)
    public Page<MajorDto> getAllMajors(String keyword, UUID departmentId, Pageable pageable) {
        // Simple search for now, can be improved with Specification
        return majorRepository.findAll(pageable).map(this::mapToDto);
    }

    @Override
    @Transactional(readOnly = true)
    public MajorDto getMajorById(UUID id) {
        return majorRepository.findById(id).map(this::mapToDto)
                .orElseThrow(() -> new RuntimeException("Major not found"));
    }

    @Override
    @Transactional
    public MajorDto createMajor(CreateMajorRequest request) {
        Major major = new Major();
        major.setMajorCode(request.getMajorCode());
        major.setMajorName(request.getMajorName());
        major.setDescription(request.getDescription());
        major.setDepartmentId(request.getDepartmentId());
        return mapToDto(majorRepository.save(major));
    }

    @Override
    @Transactional
    public MajorDto updateMajor(UUID id, CreateMajorRequest request) {
        Major major = majorRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Major not found"));
        major.setMajorCode(request.getMajorCode());
        major.setMajorName(request.getMajorName());
        major.setDescription(request.getDescription());
        major.setDepartmentId(request.getDepartmentId());
        return mapToDto(majorRepository.save(major));
    }

    @Override
    @Transactional
    public void deleteMajor(UUID id) {
        Major major = majorRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Major not found"));
        major.setIsActive(false);
        majorRepository.save(major);
    }

    private MajorDto mapToDto(Major major) {
        MajorDto dto = new MajorDto();
        dto.setMajorId(major.getMajorId());
        dto.setMajorCode(major.getMajorCode());
        dto.setMajorName(major.getMajorName());
        dto.setDescription(major.getDescription());
        dto.setDepartmentId(major.getDepartmentId());
        dto.setIsActive(major.getIsActive());
        return dto;
    }
}

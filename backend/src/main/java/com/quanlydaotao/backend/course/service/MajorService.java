package com.quanlydaotao.backend.course.service;

import com.quanlydaotao.backend.course.dto.CreateMajorRequest;
import com.quanlydaotao.backend.course.dto.MajorDto;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import java.util.UUID;

public interface MajorService {
    Page<MajorDto> getAllMajors(String keyword, UUID departmentId, Pageable pageable);
    MajorDto getMajorById(UUID id);
    MajorDto createMajor(CreateMajorRequest request);
    MajorDto updateMajor(UUID id, CreateMajorRequest request);
    void deleteMajor(UUID id);
}

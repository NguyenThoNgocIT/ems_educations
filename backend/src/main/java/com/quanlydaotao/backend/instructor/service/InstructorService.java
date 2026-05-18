package com.quanlydaotao.backend.instructor.service;

import java.util.List;
import java.util.UUID;

import com.quanlydaotao.backend.instructor.dto.InstructorCreateRequest;
import com.quanlydaotao.backend.instructor.dto.InstructorProfileDto;
import com.quanlydaotao.backend.instructor.dto.InstructorUpdateRequest;

public interface InstructorService {
    // ✅ THÊM METHOD NÀY
    InstructorProfileDto createLecturer(InstructorCreateRequest request);
    
    InstructorProfileDto getLecturerById(UUID id);
    List<InstructorProfileDto> getAllLecturers();
    InstructorProfileDto updateLecturer(UUID id, InstructorUpdateRequest request);
    void deleteLecturer(UUID id);
}
package com.quanlydaotao.backend.Instructors.service;
import java.util.List;
import java.util.UUID;

import com.quanlydaotao.backend.Instructors.dto.InstructorCreateRequest;
import com.quanlydaotao.backend.Instructors.dto.InstructorProfileDto;
import com.quanlydaotao.backend.Instructors.dto.InstructorUpdateRequest;
public interface InstructorService {
    InstructorProfileDto createLecturer(InstructorCreateRequest request);
    InstructorProfileDto getLecturerById(UUID id);
    List<InstructorProfileDto> getAllLecturers();
    InstructorProfileDto updateLecturer(UUID id, InstructorUpdateRequest request);
    void deleteLecturer(UUID id);
}


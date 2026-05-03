package com.quanlydaotao.backend.lecturer.service;
import com.quanlydaotao.backend.lecturer.dto.LecturerCreateRequest;
import com.quanlydaotao.backend.lecturer.dto.LecturerProfileDto;
import com.quanlydaotao.backend.lecturer.dto.LecturerUpdateRequest;
import java.util.List;
import java.util.UUID;
public interface LecturerService {
    LecturerProfileDto createLecturer(LecturerCreateRequest request);
    LecturerProfileDto getLecturerById(UUID id);
    List<LecturerProfileDto> getAllLecturers();
    LecturerProfileDto updateLecturer(UUID id, LecturerUpdateRequest request);
    void deleteLecturer(UUID id);
}


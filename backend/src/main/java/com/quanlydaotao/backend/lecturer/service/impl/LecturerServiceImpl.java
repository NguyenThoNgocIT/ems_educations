package com.quanlydaotao.backend.lecturer.service.impl;
import com.quanlydaotao.backend.common.exception.ResourceNotFoundException;
import com.quanlydaotao.backend.lecturer.dto.LecturerCreateRequest;
import com.quanlydaotao.backend.lecturer.dto.LecturerProfileDto;
import com.quanlydaotao.backend.lecturer.dto.LecturerUpdateRequest;
import com.quanlydaotao.backend.lecturer.entity.LecturerProfile;
import com.quanlydaotao.backend.lecturer.repository.LecturerProfileRepository;
import com.quanlydaotao.backend.lecturer.service.LecturerService;
import com.quanlydaotao.backend.user.entity.Employee;
import com.quanlydaotao.backend.user.repository.EmployeeRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;
@Service
@RequiredArgsConstructor
public class LecturerServiceImpl implements LecturerService {
    private final LecturerProfileRepository lecturerRepository;
    private final EmployeeRepository employeeRepository;
    @Override
    @Transactional
    public LecturerProfileDto createLecturer(LecturerCreateRequest request) {
        if (lecturerRepository.findByInstructorCode(request.getInstructorCode()).isPresent()) {
            throw new RuntimeException("Instructor code already exists.");
        }
        Employee employee = employeeRepository.findById(request.getEmployeeId())
                .orElseThrow(() -> new ResourceNotFoundException("Employee not found"));
        if (lecturerRepository.findByEmployeeEmployeeId(employee.getEmployeeId()).isPresent()) {
            throw new RuntimeException("Employee is already an instructor.");
        }
        LecturerProfile lecturer = new LecturerProfile();
        lecturer.setEmployee(employee);
        lecturer.setInstructorCode(request.getInstructorCode());
        lecturer.setDepartmentId(request.getDepartmentId());
        lecturer.setDegreeId(request.getDegreeId());
        lecturer = lecturerRepository.save(lecturer);
        return mapToDto(lecturer);
    }
    @Override
    @Transactional(readOnly = true)
    public LecturerProfileDto getLecturerById(UUID id) {
        LecturerProfile lecturer = lecturerRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Lecturer not found"));
        return mapToDto(lecturer);
    }
    @Override
    @Transactional(readOnly = true)
    public List<LecturerProfileDto> getAllLecturers() {
        return lecturerRepository.findAll().stream()
                .map(this::mapToDto)
                .collect(Collectors.toList());
    }
    @Override
    @Transactional
    public LecturerProfileDto updateLecturer(UUID id, LecturerUpdateRequest request) {
        LecturerProfile lecturer = lecturerRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Lecturer not found"));
        if (request.getInstructorCode() != null && !request.getInstructorCode().equals(lecturer.getInstructorCode())) {
            if (lecturerRepository.findByInstructorCode(request.getInstructorCode()).isPresent()) {
                throw new RuntimeException("Instructor code already exists.");
            }
            lecturer.setInstructorCode(request.getInstructorCode());
        }
        if (request.getDepartmentId() != null) lecturer.setDepartmentId(request.getDepartmentId());
        if (request.getDegreeId() != null) lecturer.setDegreeId(request.getDegreeId());
        if (request.getIsActive() != null) lecturer.setIsActive(request.getIsActive());
        lecturer = lecturerRepository.save(lecturer);
        return mapToDto(lecturer);
    }
    @Override
    @Transactional
    public void deleteLecturer(UUID id) {
        LecturerProfile lecturer = lecturerRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Lecturer not found"));
        lecturer.setIsActive(false);
        lecturer.setDeletedAt(LocalDateTime.now());
        lecturerRepository.save(lecturer);
    }
    private LecturerProfileDto mapToDto(LecturerProfile lecturer) {
        LecturerProfileDto dto = new LecturerProfileDto();
        dto.setId(lecturer.getInstructorId());
        dto.setEmployeeId(lecturer.getEmployee().getEmployeeId());
        dto.setInstructorCode(lecturer.getInstructorCode());
        dto.setDepartmentId(lecturer.getDepartmentId());
        dto.setDegreeId(lecturer.getDegreeId());
        dto.setEmployeeCode(lecturer.getEmployee().getEmployeeCode());
        dto.setPersonId(lecturer.getEmployee().getPerson().getPersonId());
        dto.setIsActive(lecturer.getIsActive());
        return dto;
    }
}


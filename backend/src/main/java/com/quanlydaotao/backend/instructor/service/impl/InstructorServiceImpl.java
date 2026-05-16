package com.quanlydaotao.backend.instructor.service.impl;
import com.quanlydaotao.backend.instructor.dto.InstructorCreateRequest;
import com.quanlydaotao.backend.instructor.dto.InstructorProfileDto;
import com.quanlydaotao.backend.instructor.dto.InstructorUpdateRequest;
import com.quanlydaotao.backend.instructor.entity.InstructorProfile;
import com.quanlydaotao.backend.instructor.repository.InstructorProfileRepository;
import com.quanlydaotao.backend.instructor.service.InstructorService;
import com.quanlydaotao.backend.common.exception.ResourceNotFoundException;
import com.quanlydaotao.backend.employee.entity.Employee;
import com.quanlydaotao.backend.employee.repository.EmployeeRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;
@Service
@RequiredArgsConstructor
public class InstructorServiceImpl implements InstructorService {
    private final InstructorProfileRepository lecturerRepository;
    private final EmployeeRepository employeeRepository;
    @Override
    @Transactional
    public InstructorProfileDto createLecturer(InstructorCreateRequest request) {
        if (lecturerRepository.findByInstructorCode(request.getInstructorCode()).isPresent()) {
            throw new RuntimeException("Instructor code already exists.");
        }
        Employee employee = employeeRepository.findById(request.getEmployeeId())
                .orElseThrow(() -> new ResourceNotFoundException("Employee not found"));
        if (lecturerRepository.findByEmployeeEmployeeId(employee.getEmployeeId()).isPresent()) {
            throw new RuntimeException("Employee is already an instructor.");
        }
        InstructorProfile lecturer = new InstructorProfile();
        lecturer.setEmployee(employee);
        lecturer.setInstructorCode(request.getInstructorCode());
        lecturer.setDepartmentId(request.getDepartmentId());
        lecturer.setDegreeId(request.getDegreeId());
        lecturer = lecturerRepository.save(lecturer);
        return mapToDto(lecturer);
    }
    @Override
    @Transactional(readOnly = true)
    public InstructorProfileDto getLecturerById(UUID id) {
        InstructorProfile lecturer = lecturerRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Lecturer not found"));
        return mapToDto(lecturer);
    }
    @Override
    @Transactional(readOnly = true)
    public List<InstructorProfileDto> getAllLecturers() {
        return lecturerRepository.findAll().stream()
                .map(this::mapToDto)
                .collect(Collectors.toList());
    }
    @Override
    @Transactional
    public InstructorProfileDto updateLecturer(UUID id, InstructorUpdateRequest request) {
        InstructorProfile lecturer = lecturerRepository.findById(id)
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
        InstructorProfile lecturer = lecturerRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Lecturer not found"));
        lecturer.setIsActive(false);
        lecturer.setDeletedAt(LocalDateTime.now());
        lecturerRepository.save(lecturer);
    }
    private InstructorProfileDto mapToDto(InstructorProfile lecturer) {
        InstructorProfileDto dto = new InstructorProfileDto();
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





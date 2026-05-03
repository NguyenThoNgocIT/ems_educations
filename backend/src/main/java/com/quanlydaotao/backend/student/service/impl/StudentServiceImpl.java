package com.quanlydaotao.backend.student.service.impl;
import com.quanlydaotao.backend.common.exception.ResourceNotFoundException;
import com.quanlydaotao.backend.student.dto.CreateStudentRequest;
import com.quanlydaotao.backend.student.dto.StudentDto;
import com.quanlydaotao.backend.student.dto.UpdateStudentRequest;
import com.quanlydaotao.backend.student.entity.Student;
import com.quanlydaotao.backend.student.repository.StudentRepository;
import com.quanlydaotao.backend.student.service.StudentService;
import com.quanlydaotao.backend.user.entity.Person;
import com.quanlydaotao.backend.user.repository.PersonRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;
@Service
@RequiredArgsConstructor
public class StudentServiceImpl implements StudentService {
    private final StudentRepository studentRepository;
    private final PersonRepository personRepository;
    @Override
    @Transactional
    public StudentDto createStudent(CreateStudentRequest request) {
        if (studentRepository.findByStudentCode(request.getStudentCode()).isPresent()) {
            throw new RuntimeException("Student code already exists.");
        }
        Person person = personRepository.findById(request.getPersonId())
                .orElseThrow(() -> new ResourceNotFoundException("Person not found"));
        if (studentRepository.findByPersonId(person.getId()).isPresent()) {
            throw new RuntimeException("Person is already a student.");
        }
        Student student = new Student();
        student.setPerson(person);
        student.setStudentCode(request.getStudentCode());
        student.setNote(request.getNote());
        student.setTrainingProgramId(request.getTrainingProgramId());
        student = studentRepository.save(student);
        return mapToDto(student);
    }
    @Override
    @Transactional(readOnly = true)
    public StudentDto getStudentById(UUID id) {
        Student student = studentRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Student not found"));
        return mapToDto(student);
    }
    @Override
    @Transactional(readOnly = true)
    public List<StudentDto> getAllStudents() {
        return studentRepository.findAll().stream()
                .map(this::mapToDto)
                .collect(Collectors.toList());
    }
    @Override
    @Transactional
    public StudentDto updateStudent(UUID id, UpdateStudentRequest request) {
        Student student = studentRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Student not found"));
        student.setNote(request.getNote());
        if (request.getTrainingProgramId() != null) {
            student.setTrainingProgramId(request.getTrainingProgramId());
        }
        if (request.getIsActive() != null) {
            student.setIsActive(request.getIsActive());
        }
        student = studentRepository.save(student);
        return mapToDto(student);
    }
    @Override
    @Transactional
    public void deleteStudent(UUID id) {
        Student student = studentRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Student not found"));
        student.setIsActive(false);
        student.setDeletedAt(LocalDateTime.now());
        studentRepository.save(student);
    }
    private StudentDto mapToDto(Student student) {
        StudentDto dto = new StudentDto();
        dto.setId(student.getId());
        dto.setPersonId(student.getPerson().getId());
        dto.setStudentCode(student.getStudentCode());
        dto.setNote(student.getNote());
        dto.setTrainingProgramId(student.getTrainingProgramId());
        dto.setIsActive(student.getIsActive());
        dto.setCreatedAt(student.getCreatedAt());
        dto.setUpdatedAt(student.getUpdatedAt());
        return dto;
    }
}

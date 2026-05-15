package com.quanlydaotao.backend.student.service.impl;
import com.quanlydaotao.backend.common.exception.ResourceNotFoundException;
import com.quanlydaotao.backend.student.dto.CreateStudentRequest;
import com.quanlydaotao.backend.student.dto.StudentDto;
import com.quanlydaotao.backend.student.dto.UpdateStudentRequest;
import com.quanlydaotao.backend.student.entity.Student;
import com.quanlydaotao.backend.student.repository.StudentRepository;
import com.quanlydaotao.backend.student.service.StudentService;
import com.quanlydaotao.backend.user.entity.Person;
import com.quanlydaotao.backend.user.entity.User;
import com.quanlydaotao.backend.user.repository.PersonRepository;
import com.quanlydaotao.backend.user.repository.UserRepository;
import com.quanlydaotao.backend.student.dto.EnrollStudentRequest;
import com.quanlydaotao.backend.user.entity.UserRole;
import com.quanlydaotao.backend.user.entity.UserRoleId;
import com.quanlydaotao.backend.role.repository.RoleRepository;
import com.quanlydaotao.backend.user.repository.UserRoleRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.text.Normalizer;
import java.util.List;
import java.util.UUID;
import java.util.regex.Pattern;
import java.util.stream.Collectors;
@Service
@RequiredArgsConstructor
public class StudentServiceImpl implements StudentService {
    private final StudentRepository studentRepository;
    private final PersonRepository personRepository;
    private final UserRepository userRepository;
    private final RoleRepository roleRepository;
    private final UserRoleRepository userRoleRepository;
    private final PasswordEncoder passwordEncoder;

    // Helper method to remove accents (Vietnamese)
    private String removeAccents(String text) {
        String nfdNormalizedString = Normalizer.normalize(text, Normalizer.Form.NFD);
        Pattern pattern = Pattern.compile("\\p{InCombiningDiacriticalMarks}+");
        return pattern.matcher(nfdNormalizedString).replaceAll("").replace("đ", "d").replace("Đ", "D");
    }

    @Override
    @Transactional
    public StudentDto enrollStudent(EnrollStudentRequest request) {
        if (studentRepository.findByStudentCode(request.getStudentCode()).isPresent()) {
            throw new RuntimeException("Student code already exists.");
        }

        // 1. Create Person
        Person person = new Person();
        person.setFullName(request.getFullName());
        person.setDateOfBirth(request.getDateOfBirth());
        person.setGender(request.getGender());
        person.setPhoneNumber(request.getPhoneNumber());
        person.setContactEmail(request.getContactEmail());
        person = personRepository.save(person);

        // 2. Create Student
        Student student = new Student();
        student.setPerson(person);
        student.setStudentCode(request.getStudentCode());
        student.setNote(request.getNote());
        student.setTrainingProgramId(request.getTrainingProgramId());
        student = studentRepository.save(student);

        // 3. Create User account
        String[] nameParts = request.getFullName().trim().split("\\s+");
        String firstName = removeAccents(nameParts[nameParts.length - 1]).toLowerCase();
        String generatedEmail = firstName + "." + request.getStudentCode() + "@donga.edu.vn";

        String generatedPassword = request.getDateOfBirth().format(DateTimeFormatter.ofPattern("ddMMyyyy"));

        User user = new User();
        user.setPerson(person);
        user.setUsername(request.getStudentCode());
        user.setEmail(generatedEmail);
        user.setPasswordHash(passwordEncoder.encode(generatedPassword));
        user.setRequirePasswordChange(true);
        user = userRepository.save(user);

        // 4. Assign STUDENT role
        final User finalUser = user;
        roleRepository.findByCode("STUDENT").ifPresent(role -> {
            UserRole userRole = new UserRole();
            userRole.setId(new UserRoleId(finalUser.getUserId(), role.getRoleId()));
            userRole.setUser(finalUser);
            userRole.setRole(role);
            userRole.setIsActive(true);
            userRoleRepository.save(userRole);
        });

        return mapToDto(student);
    }

    @Override
    @Transactional
    public StudentDto createStudent(CreateStudentRequest request) {
        if (studentRepository.findByStudentCode(request.getStudentCode()).isPresent()) {
            throw new RuntimeException("Student code already exists.");
        }
        Person person = personRepository.findById(request.getPersonId())
                .orElseThrow(() -> new ResourceNotFoundException("Person not found"));
        if (studentRepository.findByPersonPersonId(person.getPersonId()).isPresent()) {
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
<<<<<<< HEAD
@Override
@Transactional
public StudentDto updateStudent(UUID id, UpdateStudentRequest request) {
    Student student = studentRepository.findById(id)
            .orElseThrow(() -> new ResourceNotFoundException("Student not found"));
    
    student.setNote(request.getNote());
    
    if (request.getTrainingProgramId() != null) {
        student.setTrainingProgramId(request.getTrainingProgramId());
=======
    @Override
    @Transactional
    public StudentDto updateStudent(UUID id, UpdateStudentRequest request) {
        Student student = studentRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Student not found"));
        student.setNote(request.getNote());
        
        // Update Person info
        Person person = student.getPerson();
        if (request.getFullName() != null) person.setFullName(request.getFullName());
        if (request.getDateOfBirth() != null) person.setDateOfBirth(request.getDateOfBirth());
        if (request.getGender() != null) person.setGender(request.getGender());
        if (request.getPhoneNumber() != null) person.setPhoneNumber(request.getPhoneNumber());
        if (request.getContactEmail() != null) person.setContactEmail(request.getContactEmail());
        personRepository.save(person);

        if (request.getTrainingProgramId() != null) {
            student.setTrainingProgramId(request.getTrainingProgramId());
        }
        if (request.getIsActive() != null) {
            student.setIsActive(request.getIsActive());
        }
        student = studentRepository.save(student);
        return mapToDto(student);
>>>>>>> eb2033de817f51357d899eb8aec3941270d66d64
    }
    if (request.getIsActive() != null) {
        student.setIsActive(request.getIsActive());
    }
    
    // ✅ THÊM CẬP NHẬT SĐT VÀ EMAIL CHO PERSON
    Person person = student.getPerson();
    if (request.getPhoneNumber() != null) {
        person.setPhoneNumber(request.getPhoneNumber());
    }
    if (request.getContactEmail() != null) {
        person.setContactEmail(request.getContactEmail());
    }
    personRepository.save(person);
    
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
    dto.setId(student.getStudentId());
    dto.setPersonId(student.getPerson().getPersonId());
    dto.setFullName(student.getPerson().getFullName());
    dto.setDateOfBirth(student.getPerson().getDateOfBirth());
    dto.setGender(student.getPerson().getGender());
    dto.setPhoneNumber(student.getPerson().getPhoneNumber());
    dto.setContactEmail(student.getPerson().getContactEmail());
    dto.setStudentCode(student.getStudentCode());
    dto.setNote(student.getNote());
    dto.setTrainingProgramId(student.getTrainingProgramId());
    dto.setIsActive(student.getIsActive());
    dto.setCreatedAt(student.getCreatedAt());
    dto.setUpdatedAt(student.getUpdatedAt());
    return dto;
    }
}

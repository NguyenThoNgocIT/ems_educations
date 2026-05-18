package com.quanlydaotao.backend.student.service.impl;

<<<<<<< HEAD
=======
import com.quanlydaotao.backend.account.dto.AccountCreationResponse;
import com.quanlydaotao.backend.account.service.impl.AccountServiceImpl;
import com.quanlydaotao.backend.common.exception.BusinessException;
>>>>>>> 68ed462f52dc6c66431b71bdffafca4c8f644fd1
import com.quanlydaotao.backend.common.exception.ResourceNotFoundException;
import com.quanlydaotao.backend.course.entity.TrainingProgram;
import com.quanlydaotao.backend.course.repository.AcademicCohortRepository;
import com.quanlydaotao.backend.course.repository.MajorRepository;
import com.quanlydaotao.backend.course.repository.TrainingProgramRepository;
import com.quanlydaotao.backend.person.entity.Person;
import com.quanlydaotao.backend.person.repository.PersonRepository;
import com.quanlydaotao.backend.student.dto.StudentAdminResponse;
import com.quanlydaotao.backend.student.dto.StudentAdminCreateRequest;
import com.quanlydaotao.backend.student.dto.StudentAdminUpdateRequest;
import com.quanlydaotao.backend.student.dto.StudentSelfResponse;
import com.quanlydaotao.backend.student.dto.StudentSelfUpdateRequest;
import com.quanlydaotao.backend.student.entity.Student;
import com.quanlydaotao.backend.student.repository.StudentRepository;
import com.quanlydaotao.backend.student.service.StudentService;
import com.quanlydaotao.backend.user.entity.User;
import com.quanlydaotao.backend.user.repository.UserRepository;
import com.quanlydaotao.backend.utils.StringUtil;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.util.StringUtils;

import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;
<<<<<<< HEAD
import java.util.regex.Pattern;
import java.util.stream.Collectors;
=======
>>>>>>> 68ed462f52dc6c66431b71bdffafca4c8f644fd1

@Service
@RequiredArgsConstructor
public class StudentServiceImpl implements StudentService {

    private final StudentRepository studentRepository;
    private final PersonRepository personRepository;
    private final UserRepository userRepository;
    private final TrainingProgramRepository trainingProgramRepository;
    private final AccountServiceImpl accountService;
    private final MajorRepository majorRepository;
    private final AcademicCohortRepository academicCohortRepository;

<<<<<<< HEAD
    // Helper method to remove accents (Vietnamese)
    private String removeAccents(String text) {
        String nfdNormalizedString = Normalizer.normalize(text, Normalizer.Form.NFD);
        Pattern pattern = Pattern.compile("\\p{InCombiningDiacriticalMarks}+");
        return pattern.matcher(nfdNormalizedString).replaceAll("").replace("đ", "d").replace("Đ", "D");
    }

    // ✅ THÊM METHOD createStudent
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

    // ✅ THÊM METHOD enrollStudent
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
        userRepository.save(user);

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
        
        // Update Person info
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

=======
>>>>>>> 68ed462f52dc6c66431b71bdffafca4c8f644fd1
    @Override
    @Transactional
    public AccountCreationResponse createStudentForAdmin(StudentAdminCreateRequest request) {
        return accountService.createStudentAccount(request);
    }

    @Override
    @Transactional(readOnly = true)
    public List<StudentAdminResponse> getAllStudentsForAdmin() {
        return studentRepository.findAll().stream()
                .map(this::toAdminResponse)
                .toList();
    }

    @Override
    @Transactional(readOnly = true)
    public StudentAdminResponse getStudentForAdmin(UUID id) {
        return toAdminResponse(findStudent(id));
    }

    @Override
    @Transactional
    public StudentAdminResponse updateStudentForAdmin(UUID id, StudentAdminUpdateRequest request) {
        Student student = findStudent(id);
        Person person = student.getPerson();

        if (StringUtils.hasText(request.getStudentCode()) && !request.getStudentCode().equalsIgnoreCase(student.getStudentCode())) {
            String studentCode = request.getStudentCode().trim().toUpperCase();
            if (studentRepository.findByStudentCode(studentCode).isPresent()) {
                throw new BusinessException("Mã sinh viên đã tồn tại");
            }
            student.setStudentCode(studentCode);
        }
        if (request.getTrainingProgramId() != null) {
            validateStudentProgramSelection(request.getMajorId(), request.getTrainingProgramId(), request.getAcademicCohortId());
            student.setTrainingProgramId(request.getTrainingProgramId());
        }
        if (request.getMajorId() != null) {
            if (!majorRepository.existsById(request.getMajorId())) {
                throw new BusinessException("Ngành không tồn tại");
            }
            student.setMajorId(request.getMajorId());
        }
        if (request.getAcademicCohortId() != null) {
            if (!academicCohortRepository.existsById(request.getAcademicCohortId())) {
                throw new BusinessException("Khóa học không tồn tại");
            }
            student.setAcademicCohortId(request.getAcademicCohortId());
        }
        if (request.getClassId() != null) {
            student.setClassId(request.getClassId());
        }
        if (request.getAdmissionDate() != null) {
            student.setAdmissionDate(request.getAdmissionDate());
        }
        if (request.getNote() != null) {
            student.setNote(request.getNote());
        }
        if (request.getIsActive() != null) {
            student.setIsActive(request.getIsActive());
        }

        updatePersonForAdmin(person, request);
        personRepository.save(person);
        return toAdminResponse(studentRepository.save(student));
    }

    @Override
    @Transactional
    public void deleteStudentForAdmin(UUID id) {
        Student student = findStudent(id);
        student.setIsActive(false);
        student.setDeletedAt(LocalDateTime.now());
        studentRepository.save(student);
        userRepository.findByPersonPersonId(student.getPerson().getPersonId()).ifPresent(user -> {
            user.setIsActive(false);
            user.setDeletedAt(LocalDateTime.now());
            userRepository.save(user);
        });
    }

<<<<<<< HEAD
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
=======
    @Override
    @Transactional(readOnly = true)
    public StudentSelfResponse getCurrentStudent(String username) {
        return toSelfResponse(findCurrentStudent(username));
    }

    @Override
    @Transactional
    public StudentSelfResponse updateCurrentStudent(String username, StudentSelfUpdateRequest request) {
        Student student = findCurrentStudent(username);
        Person person = student.getPerson();
        updatePersonForSelf(person, request);
        personRepository.save(person);
        return toSelfResponse(student);
    }

    private Student findStudent(UUID id) {
        return studentRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Không tìm thấy sinh viên"));
    }

    private Student findCurrentStudent(String username) {
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new ResourceNotFoundException("Không tìm thấy tài khoản"));
        return studentRepository.findByPersonPersonId(user.getPerson().getPersonId())
                .orElseThrow(() -> new ResourceNotFoundException("Tài khoản hiện tại không phải sinh viên"));
    }

    private void updatePersonForAdmin(Person person, StudentAdminUpdateRequest request) {
        if (StringUtils.hasText(request.getFullName())) {
            person.setFullName(request.getFullName().trim());
        }
        if (StringUtils.hasText(request.getFullNameNoAccent())) {
            person.setFullNameNoAccent(StringUtil.normalizeForAccountCode(request.getFullNameNoAccent()));
        } else if (StringUtils.hasText(request.getFullName())) {
            person.setFullNameNoAccent(StringUtil.getFirstNameNoAccent(request.getFullName()));
        }
        if (request.getGender() != null) person.setGender(request.getGender());
        if (request.getDateOfBirth() != null) person.setDateOfBirth(request.getDateOfBirth());
        if (request.getPlaceOfBirth() != null) person.setPlaceOfBirth(request.getPlaceOfBirth());
        if (request.getEthnicity() != null) person.setEthnicity(request.getEthnicity());
        if (request.getPersonalIdentificationNumber() != null) person.setPersonalIdentificationNumber(request.getPersonalIdentificationNumber());
        if (request.getDateOfIssue() != null) person.setDateOfIssue(request.getDateOfIssue());
        if (request.getCardPlace() != null) person.setCardPlace(request.getCardPlace());
        if (request.getNationality() != null) person.setNationality(request.getNationality());
        if (request.getContactEmail() != null) person.setContactEmail(request.getContactEmail());
        if (request.getPhoneNumber() != null) person.setPhoneNumber(request.getPhoneNumber());
        if (request.getPermanentAddress() != null) person.setPermanentAddress(request.getPermanentAddress());
        if (request.getTemporaryAddress() != null) person.setTemporaryAddress(request.getTemporaryAddress());
        if (request.getAvatarUrl() != null) person.setAvatarUrl(request.getAvatarUrl());
    }

    private void updatePersonForSelf(Person person, StudentSelfUpdateRequest request) {
        if (StringUtils.hasText(request.getFullName())) {
            person.setFullName(request.getFullName().trim());
            person.setFullNameNoAccent(StringUtil.getFirstNameNoAccent(request.getFullName()));
        }
        if (request.getGender() != null) person.setGender(request.getGender());
        if (request.getDateOfBirth() != null) person.setDateOfBirth(request.getDateOfBirth());
        if (request.getPlaceOfBirth() != null) person.setPlaceOfBirth(request.getPlaceOfBirth());
        if (request.getEthnicity() != null) person.setEthnicity(request.getEthnicity());
        if (request.getDateOfIssue() != null) person.setDateOfIssue(request.getDateOfIssue());
        if (request.getCardPlace() != null) person.setCardPlace(request.getCardPlace());
        if (request.getNationality() != null) person.setNationality(request.getNationality());
        if (request.getContactEmail() != null) person.setContactEmail(request.getContactEmail());
        if (request.getPhoneNumber() != null) person.setPhoneNumber(request.getPhoneNumber());
        if (request.getPermanentAddress() != null) person.setPermanentAddress(request.getPermanentAddress());
        if (request.getTemporaryAddress() != null) person.setTemporaryAddress(request.getTemporaryAddress());
        if (request.getAvatarUrl() != null) person.setAvatarUrl(request.getAvatarUrl());
    }

    private StudentAdminResponse toAdminResponse(Student student) {
        Person person = student.getPerson();
        StudentAdminResponse response = new StudentAdminResponse();
        response.setStudentId(student.getStudentId());
        response.setPersonId(person.getPersonId());
        response.setStudentCode(student.getStudentCode());
        response.setMajorId(student.getMajorId());
        response.setTrainingProgramId(student.getTrainingProgramId());
        response.setAcademicCohortId(student.getAcademicCohortId());
        response.setClassId(student.getClassId());
        response.setAdmissionDate(student.getAdmissionDate());
        response.setNote(student.getNote());
        response.setIsActive(student.getIsActive());
        response.setCreatedAt(student.getCreatedAt());
        response.setUpdatedAt(student.getUpdatedAt());
        fillPerson(response, person);
        return response;
    }

    private StudentSelfResponse toSelfResponse(Student student) {
        Person person = student.getPerson();
        StudentSelfResponse response = new StudentSelfResponse();
        response.setStudentId(student.getStudentId());
        response.setStudentCode(student.getStudentCode());
        response.setMajorId(student.getMajorId());
        response.setTrainingProgramId(student.getTrainingProgramId());
        response.setAcademicCohortId(student.getAcademicCohortId());
        response.setClassId(student.getClassId());
        response.setAdmissionDate(student.getAdmissionDate());
        response.setNote(student.getNote());
        response.setPersonId(person.getPersonId());
        response.setFullName(person.getFullName());
        response.setFullNameNoAccent(person.getFullNameNoAccent());
        response.setGender(person.getGender());
        response.setDateOfBirth(person.getDateOfBirth());
        response.setPlaceOfBirth(person.getPlaceOfBirth());
        response.setEthnicity(person.getEthnicity());
        response.setPersonalIdentificationNumber(person.getPersonalIdentificationNumber());
        response.setDateOfIssue(person.getDateOfIssue());
        response.setCardPlace(person.getCardPlace());
        response.setNationality(person.getNationality());
        response.setContactEmail(person.getContactEmail());
        response.setPhoneNumber(person.getPhoneNumber());
        response.setPermanentAddress(person.getPermanentAddress());
        response.setTemporaryAddress(person.getTemporaryAddress());
        response.setAvatarUrl(person.getAvatarUrl());
        return response;
    }

    private void fillPerson(StudentAdminResponse response, Person person) {
        response.setFullName(person.getFullName());
        response.setFullNameNoAccent(person.getFullNameNoAccent());
        response.setGender(person.getGender());
        response.setDateOfBirth(person.getDateOfBirth());
        response.setPlaceOfBirth(person.getPlaceOfBirth());
        response.setEthnicity(person.getEthnicity());
        response.setPersonalIdentificationNumber(person.getPersonalIdentificationNumber());
        response.setDateOfIssue(person.getDateOfIssue());
        response.setCardPlace(person.getCardPlace());
        response.setNationality(person.getNationality());
        response.setContactEmail(person.getContactEmail());
        response.setPhoneNumber(person.getPhoneNumber());
        response.setPermanentAddress(person.getPermanentAddress());
        response.setTemporaryAddress(person.getTemporaryAddress());
        response.setAvatarUrl(person.getAvatarUrl());
    }

    private void validateStudentProgramSelection(UUID majorId, UUID trainingProgramId, UUID academicCohortId) {
        TrainingProgram trainingProgram = trainingProgramRepository.findById(trainingProgramId)
                .orElseThrow(() -> new BusinessException("Chương trình đào tạo không tồn tại"));
        if (majorId != null && trainingProgram.getMajorId() != null && !majorId.equals(trainingProgram.getMajorId())) {
            throw new BusinessException("Ngành không khớp với chương trình đào tạo");
        }
        if (academicCohortId != null && trainingProgram.getAcademicCohortId() != null && !academicCohortId.equals(trainingProgram.getAcademicCohortId())) {
            throw new BusinessException("Khóa học không khớp với chương trình đào tạo");
        }
    }
}
>>>>>>> 68ed462f52dc6c66431b71bdffafca4c8f644fd1

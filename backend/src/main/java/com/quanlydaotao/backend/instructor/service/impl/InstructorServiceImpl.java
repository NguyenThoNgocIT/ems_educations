package com.quanlydaotao.backend.instructor.service.impl;

<<<<<<< HEAD
import com.quanlydaotao.backend.instructor.dto.InstructorCreateRequest;
import com.quanlydaotao.backend.instructor.dto.InstructorProfileDto;
import com.quanlydaotao.backend.instructor.dto.InstructorUpdateRequest;
=======
import com.quanlydaotao.backend.account.dto.AccountCreationResponse;
import com.quanlydaotao.backend.account.service.impl.AccountServiceImpl;
import com.quanlydaotao.backend.common.exception.BusinessException;
import com.quanlydaotao.backend.common.exception.ResourceNotFoundException;
import com.quanlydaotao.backend.course.repository.MajorRepository;
import com.quanlydaotao.backend.degree.repository.DegreeRepository;
import com.quanlydaotao.backend.department.repository.DepartmentRepository;
import com.quanlydaotao.backend.employee.entity.Employee;
import com.quanlydaotao.backend.employee.repository.EmployeeRepository;
import com.quanlydaotao.backend.instructor.dto.InstructorAdminResponse;
import com.quanlydaotao.backend.instructor.dto.InstructorAdminCreateRequest;
import com.quanlydaotao.backend.instructor.dto.InstructorAdminUpdateRequest;
import com.quanlydaotao.backend.instructor.dto.InstructorSelfResponse;
import com.quanlydaotao.backend.instructor.dto.InstructorSelfUpdateRequest;
>>>>>>> 68ed462f52dc6c66431b71bdffafca4c8f644fd1
import com.quanlydaotao.backend.instructor.entity.InstructorProfile;
import com.quanlydaotao.backend.instructor.repository.InstructorProfileRepository;
import com.quanlydaotao.backend.instructor.service.InstructorService;
import com.quanlydaotao.backend.person.entity.Person;
import com.quanlydaotao.backend.person.repository.PersonRepository;
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
import java.util.stream.Collectors;
=======
>>>>>>> 68ed462f52dc6c66431b71bdffafca4c8f644fd1

@Service
@RequiredArgsConstructor
public class InstructorServiceImpl implements InstructorService {
<<<<<<< HEAD

    private final InstructorProfileRepository lecturerRepository;
    private final EmployeeRepository employeeRepository;

    @Override
    @Transactional
    public InstructorProfileDto createLecturer(InstructorCreateRequest request) {
        // Kiểm tra mã giảng viên đã tồn tại chưa
        if (lecturerRepository.findByInstructorCode(request.getInstructorCode()).isPresent()) {
            throw new RuntimeException("Instructor code already exists.");
        }
        
        // Lấy Employee từ employeeId
        Employee employee = employeeRepository.findById(request.getEmployeeId())
                .orElseThrow(() -> new ResourceNotFoundException("Employee not found"));
        
        // Tạo InstructorProfile mới
        InstructorProfile instructor = new InstructorProfile();
        instructor.setEmployee(employee);
        instructor.setInstructorCode(request.getInstructorCode());
        instructor.setDepartmentId(request.getDepartmentId());
        instructor.setDegreeId(request.getDegreeId());
        instructor.setIsActive(true);
        
        instructor = lecturerRepository.save(instructor);
        return mapToDto(instructor);
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
=======
    private final InstructorProfileRepository instructorProfileRepository;
    private final EmployeeRepository employeeRepository;
    private final PersonRepository personRepository;
    private final UserRepository userRepository;
    private final DepartmentRepository departmentRepository;
    private final DegreeRepository degreeRepository;
    private final AccountServiceImpl accountService;
    private final MajorRepository majorRepository;

    @Override
    @Transactional
    public AccountCreationResponse createInstructorForAdmin(InstructorAdminCreateRequest request) {
        return accountService.createInstructorAccount(request);
    }

    @Override
    @Transactional(readOnly = true)
    public List<InstructorAdminResponse> getAllInstructorsForAdmin() {
        return instructorProfileRepository.findAll().stream()
                .map(this::toAdminResponse)
                .toList();
    }

    @Override
    @Transactional(readOnly = true)
    public InstructorAdminResponse getInstructorForAdmin(UUID id) {
        return toAdminResponse(findInstructor(id));
    }

    @Override
    @Transactional
    public InstructorAdminResponse updateInstructorForAdmin(UUID id, InstructorAdminUpdateRequest request) {
        InstructorProfile instructor = findInstructor(id);
        Employee employee = instructor.getEmployee();
        Person person = employee.getPerson();

        if (StringUtils.hasText(request.getEmployeeCode()) && !request.getEmployeeCode().equalsIgnoreCase(employee.getEmployeeCode())) {
            String employeeCode = request.getEmployeeCode().trim().toUpperCase();
            if (employeeRepository.findByEmployeeCode(employeeCode).isPresent()) {
                throw new BusinessException("Mã nhân viên đã tồn tại");
>>>>>>> 68ed462f52dc6c66431b71bdffafca4c8f644fd1
            }
            employee.setEmployeeCode(employeeCode);
        }
<<<<<<< HEAD
        if (request.getDepartmentId() != null) lecturer.setDepartmentId(request.getDepartmentId());
        if (request.getDegreeId() != null) lecturer.setDegreeId(request.getDegreeId());
        if (request.getIsActive() != null) lecturer.setIsActive(request.getIsActive());
        
        lecturer = lecturerRepository.save(lecturer);
        return mapToDto(lecturer);
=======
        if (StringUtils.hasText(request.getInstructorCode()) && !request.getInstructorCode().equalsIgnoreCase(instructor.getInstructorCode())) {
            String instructorCode = request.getInstructorCode().trim().toUpperCase();
            if (instructorProfileRepository.findByInstructorCode(instructorCode).isPresent()) {
                throw new BusinessException("Mã giảng viên đã tồn tại");
            }
            instructor.setInstructorCode(instructorCode);
        }
        if (request.getDepartmentId() != null) {
            if (!departmentRepository.existsById(request.getDepartmentId())) {
                throw new BusinessException("Khoa/Bộ môn không tồn tại");
            }
            instructor.setDepartmentId(request.getDepartmentId());
        }
        if (request.getDegreeId() != null) {
            if (!degreeRepository.existsById(request.getDegreeId())) {
                throw new BusinessException("Học vị không tồn tại");
            }
            instructor.setDegreeId(request.getDegreeId());
        }
        if (request.getMajorId() != null) {
            if (!majorRepository.existsById(request.getMajorId())) {
                throw new BusinessException("Ngành không tồn tại");
            }
            instructor.setMajorId(request.getMajorId());
        }
        if (request.getAcademicRank() != null) instructor.setAcademicRank(request.getAcademicRank());
        if (request.getSpecialization() != null) instructor.setSpecialization(request.getSpecialization());
        if (request.getInstitution() != null) instructor.setInstitution(request.getInstitution());
        if (request.getGraduationYear() != null) instructor.setGraduationYear(request.getGraduationYear());
        if (request.getStartWorkDate() != null) employee.setStartWorkDate(request.getStartWorkDate());
        if (request.getEndWorkDate() != null) employee.setEndWorkDate(request.getEndWorkDate());
        if (request.getEmployeeStatus() != null) employee.setStatus(request.getEmployeeStatus());
        if (request.getContractType() != null) employee.setContractType(request.getContractType());
        if (request.getNote() != null) employee.setNote(request.getNote());
        if (request.getIsActive() != null) {
            instructor.setIsActive(request.getIsActive());
            employee.setIsActive(request.getIsActive());
        }

        updatePersonForAdmin(person, request);
        personRepository.save(person);
        employeeRepository.save(employee);
        return toAdminResponse(instructorProfileRepository.save(instructor));
>>>>>>> 68ed462f52dc6c66431b71bdffafca4c8f644fd1
    }

    @Override
    @Transactional
    public void deleteInstructorForAdmin(UUID id) {
        InstructorProfile instructor = findInstructor(id);
        Employee employee = instructor.getEmployee();
        instructor.setIsActive(false);
        instructor.setDeletedAt(LocalDateTime.now());
        employee.setIsActive(false);
        employee.setDeletedAt(LocalDateTime.now());
        instructorProfileRepository.save(instructor);
        employeeRepository.save(employee);
        userRepository.findByPersonPersonId(employee.getPerson().getPersonId()).ifPresent(user -> {
            user.setIsActive(false);
            user.setDeletedAt(LocalDateTime.now());
            userRepository.save(user);
        });
    }

<<<<<<< HEAD
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
=======
    @Override
    @Transactional(readOnly = true)
    public InstructorSelfResponse getCurrentInstructor(String username) {
        return toSelfResponse(findCurrentInstructor(username));
    }

    @Override
    @Transactional
    public InstructorSelfResponse updateCurrentInstructor(String username, InstructorSelfUpdateRequest request) {
        InstructorProfile instructor = findCurrentInstructor(username);
        Person person = instructor.getEmployee().getPerson();
        updatePersonForSelf(person, request);
        personRepository.save(person);
        return toSelfResponse(instructor);
    }

    private InstructorProfile findInstructor(UUID id) {
        return instructorProfileRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Không tìm thấy giảng viên"));
    }

    private InstructorProfile findCurrentInstructor(String username) {
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new ResourceNotFoundException("Không tìm thấy tài khoản"));
        Employee employee = employeeRepository.findByPersonPersonId(user.getPerson().getPersonId())
                .orElseThrow(() -> new ResourceNotFoundException("Tài khoản hiện tại không có hồ sơ nhân viên"));
        return instructorProfileRepository.findByEmployeeEmployeeId(employee.getEmployeeId())
                .orElseThrow(() -> new ResourceNotFoundException("Tài khoản hiện tại không phải giảng viên"));
    }

    private void updatePersonForAdmin(Person person, InstructorAdminUpdateRequest request) {
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

    private void updatePersonForSelf(Person person, InstructorSelfUpdateRequest request) {
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

    private InstructorAdminResponse toAdminResponse(InstructorProfile instructor) {
        Employee employee = instructor.getEmployee();
        Person person = employee.getPerson();
        InstructorAdminResponse response = new InstructorAdminResponse();
        response.setEmployeeId(employee.getEmployeeId());
        response.setEmployeeCode(employee.getEmployeeCode());
        response.setInstructorCode(instructor.getInstructorCode());
        response.setStartWorkDate(employee.getStartWorkDate());
        response.setEndWorkDate(employee.getEndWorkDate());
        response.setEmployeeStatus(employee.getStatus());
        response.setEmployeeType(employee.getEmployeeType());
        response.setContractType(employee.getContractType());
        response.setNote(employee.getNote());
        response.setDepartmentId(instructor.getDepartmentId());
        response.setDegreeId(instructor.getDegreeId());
        response.setAcademicRank(instructor.getAcademicRank());
        response.setMajorId(instructor.getMajorId());
        response.setSpecialization(instructor.getSpecialization());
        response.setInstitution(instructor.getInstitution());
        response.setGraduationYear(instructor.getGraduationYear());
        response.setIsActive(instructor.getIsActive());
        response.setCreatedAt(instructor.getCreatedAt());
        response.setUpdatedAt(instructor.getUpdatedAt());
        fillPerson(response, person);
        return response;
    }

    private InstructorSelfResponse toSelfResponse(InstructorProfile instructor) {
        Employee employee = instructor.getEmployee();
        Person person = employee.getPerson();
        InstructorSelfResponse response = new InstructorSelfResponse();
        response.setEmployeeId(employee.getEmployeeId());
        response.setEmployeeCode(employee.getEmployeeCode());
        response.setInstructorCode(instructor.getInstructorCode());
        response.setStartWorkDate(employee.getStartWorkDate());
        response.setEmployeeStatus(employee.getStatus());
        response.setContractType(employee.getContractType());
        response.setDepartmentId(instructor.getDepartmentId());
        response.setDegreeId(instructor.getDegreeId());
        response.setAcademicRank(instructor.getAcademicRank());
        response.setMajorId(instructor.getMajorId());
        response.setSpecialization(instructor.getSpecialization());
        response.setInstitution(instructor.getInstitution());
        response.setGraduationYear(instructor.getGraduationYear());
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

    private void fillPerson(InstructorAdminResponse response, Person person) {
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
    }
}
>>>>>>> 68ed462f52dc6c66431b71bdffafca4c8f644fd1

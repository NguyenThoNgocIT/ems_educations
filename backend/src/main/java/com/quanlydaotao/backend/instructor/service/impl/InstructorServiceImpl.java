package com.quanlydaotao.backend.instructor.service.impl;

import com.quanlydaotao.backend.account.dto.AccountCreationResponse;
import com.quanlydaotao.backend.account.service.impl.AccountServiceImpl;
import com.quanlydaotao.backend.common.exception.BusinessException;
import com.quanlydaotao.backend.common.exception.ResourceNotFoundException;
import com.quanlydaotao.backend.major.repository.MajorRepository;
import com.quanlydaotao.backend.degree.repository.DegreeRepository;
import com.quanlydaotao.backend.department.repository.DepartmentRepository;
import com.quanlydaotao.backend.employee.entity.Employee;
import com.quanlydaotao.backend.employee.repository.EmployeeRepository;
import com.quanlydaotao.backend.instructor.dto.InstructorAdminResponse;
import com.quanlydaotao.backend.instructor.dto.InstructorAdminCreateRequest;
import com.quanlydaotao.backend.instructor.dto.InstructorAdminUpdateRequest;
import com.quanlydaotao.backend.instructor.dto.InstructorSelfResponse;
import com.quanlydaotao.backend.instructor.dto.InstructorSelfUpdateRequest;
import com.quanlydaotao.backend.instructor.entity.InstructorProfile;
import com.quanlydaotao.backend.instructor.mapper.InstructorMapper;
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

@Service
@RequiredArgsConstructor
public class InstructorServiceImpl implements InstructorService {
    private final InstructorProfileRepository instructorProfileRepository;
    private final EmployeeRepository employeeRepository;
    private final PersonRepository personRepository;
    private final UserRepository userRepository;
    private final DepartmentRepository departmentRepository;
    private final DegreeRepository degreeRepository;
    private final AccountServiceImpl accountService;
    private final MajorRepository majorRepository;
    private final InstructorMapper instructorMapper;

    @Override
    @Transactional
    public AccountCreationResponse createInstructorForAdmin(InstructorAdminCreateRequest request) {
        return accountService.createInstructorAccount(request);
    }

    @Override
    @Transactional(readOnly = true)
    public List<InstructorAdminResponse> getAllInstructorsForAdmin() {
        return instructorMapper.toDtoList(instructorProfileRepository.findAllByIsActiveTrueAndDeletedAtIsNull());
    }

    @Override
    @Transactional(readOnly = true)
    public InstructorAdminResponse getInstructorForAdmin(UUID id) {
        return instructorMapper.toDto(findInstructor(id));
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
            }
            employee.setEmployeeCode(employeeCode);
        }
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
        return instructorMapper.toDto(instructorProfileRepository.save(instructor));
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

    @Override
    @Transactional(readOnly = true)
    public InstructorSelfResponse getCurrentInstructor(String username) {
        return instructorMapper.toSelfDto(findCurrentInstructor(username));
    }

    @Override
    @Transactional
    public InstructorSelfResponse updateCurrentInstructor(String username, InstructorSelfUpdateRequest request) {
        InstructorProfile instructor = findCurrentInstructor(username);
        Person person = instructor.getEmployee().getPerson();
        updatePersonForSelf(person, request);
        personRepository.save(person);
        return instructorMapper.toSelfDto(instructor);
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

}

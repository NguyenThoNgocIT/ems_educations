package com.quanlydaotao.backend.staff.service.impl;

import com.quanlydaotao.backend.account.dto.AccountCreationResponse;
import com.quanlydaotao.backend.account.service.impl.AccountServiceImpl;
import com.quanlydaotao.backend.common.exception.BusinessException;
import com.quanlydaotao.backend.common.exception.ResourceNotFoundException;
import com.quanlydaotao.backend.employee.entity.Employee;
import com.quanlydaotao.backend.employee.repository.EmployeeRepository;
import com.quanlydaotao.backend.person.entity.Person;
import com.quanlydaotao.backend.person.repository.PersonRepository;
import com.quanlydaotao.backend.staff.dto.StaffAdminResponse;
import com.quanlydaotao.backend.staff.dto.StaffAdminCreateRequest;
import com.quanlydaotao.backend.staff.dto.StaffAdminUpdateRequest;
import com.quanlydaotao.backend.staff.dto.StaffSelfResponse;
import com.quanlydaotao.backend.staff.dto.StaffSelfUpdateRequest;
import com.quanlydaotao.backend.staff.entity.Staff;
import com.quanlydaotao.backend.staff.repository.StaffRepository;
import com.quanlydaotao.backend.staff.service.StaffService;
import com.quanlydaotao.backend.user.entity.User;
import com.quanlydaotao.backend.user.repository.UserRepository;
import com.quanlydaotao.backend.utils.StringUtil;
import jakarta.persistence.EntityManager;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.util.StringUtils;

import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class StaffServiceImpl implements StaffService {
    private final StaffRepository staffRepository;
    private final EmployeeRepository employeeRepository;
    private final PersonRepository personRepository;
    private final UserRepository userRepository;
    private final EntityManager entityManager;
    private final AccountServiceImpl accountService;

    @Override
    @Transactional
    public AccountCreationResponse createStaffForAdmin(StaffAdminCreateRequest request) {
        return accountService.createStaffAccount(request);
    }

    @Override
    @Transactional(readOnly = true)
    public List<StaffAdminResponse> getAllStaffsForAdmin() {
        return staffRepository.findAll().stream()
                .map(this::toAdminResponse)
                .toList();
    }

    @Override
    @Transactional(readOnly = true)
    public StaffAdminResponse getStaffForAdmin(UUID id) {
        return toAdminResponse(findStaff(id));
    }

    @Override
    @Transactional
    public StaffAdminResponse updateStaffForAdmin(UUID id, StaffAdminUpdateRequest request) {
        Staff staff = findStaff(id);
        Employee employee = staff.getEmployee();
        Person person = employee.getPerson();

        if (StringUtils.hasText(request.getEmployeeCode()) && !request.getEmployeeCode().equalsIgnoreCase(employee.getEmployeeCode())) {
            String employeeCode = request.getEmployeeCode().trim().toUpperCase();
            if (employeeRepository.findByEmployeeCode(employeeCode).isPresent()) {
                throw new BusinessException("Mã nhân viên đã tồn tại");
            }
            employee.setEmployeeCode(employeeCode);
        }
        if (StringUtils.hasText(request.getStaffCode()) && !request.getStaffCode().equalsIgnoreCase(staff.getStaffCode())) {
            String staffCode = request.getStaffCode().trim().toUpperCase();
            if (staffRepository.findByStaffCode(staffCode).isPresent()) {
                throw new BusinessException("Mã nhân viên hành chính đã tồn tại");
            }
            staff.setStaffCode(staffCode);
        }
        if (request.getDivisionId() != null) {
            if (!existsActiveReference("Divisions", "DivisionId", request.getDivisionId())) {
                throw new BusinessException("Phòng ban không tồn tại");
            }
            staff.setDivisionId(request.getDivisionId());
        }
        if (request.getPositionId() != null) {
            if (!existsActiveReference("Positions", "PositionId", request.getPositionId())) {
                throw new BusinessException("Chức vụ không tồn tại");
            }
            staff.setPositionId(request.getPositionId());
        }
        if (request.getStartWorkDate() != null) employee.setStartWorkDate(request.getStartWorkDate());
        if (request.getEndWorkDate() != null) employee.setEndWorkDate(request.getEndWorkDate());
        if (request.getEmployeeStatus() != null) employee.setStatus(request.getEmployeeStatus());
        if (request.getContractType() != null) employee.setContractType(request.getContractType());
        if (request.getNote() != null) employee.setNote(request.getNote());
        if (request.getIsActive() != null) {
            staff.setIsActive(request.getIsActive());
            employee.setIsActive(request.getIsActive());
        }

        updatePersonForAdmin(person, request);
        personRepository.save(person);
        employeeRepository.save(employee);
        return toAdminResponse(staffRepository.save(staff));
    }

    @Override
    @Transactional
    public void deleteStaffForAdmin(UUID id) {
        Staff staff = findStaff(id);
        Employee employee = staff.getEmployee();
        staff.setIsActive(false);
        staff.setDeletedAt(LocalDateTime.now());
        employee.setIsActive(false);
        employee.setDeletedAt(LocalDateTime.now());
        staffRepository.save(staff);
        employeeRepository.save(employee);
        userRepository.findByPersonPersonId(employee.getPerson().getPersonId()).ifPresent(user -> {
            user.setIsActive(false);
            user.setDeletedAt(LocalDateTime.now());
            userRepository.save(user);
        });
    }

    @Override
    @Transactional(readOnly = true)
    public StaffSelfResponse getCurrentStaff(String username) {
        return toSelfResponse(findCurrentStaff(username));
    }

    @Override
    @Transactional
    public StaffSelfResponse updateCurrentStaff(String username, StaffSelfUpdateRequest request) {
        Staff staff = findCurrentStaff(username);
        Person person = staff.getEmployee().getPerson();
        updatePersonForSelf(person, request);
        personRepository.save(person);
        return toSelfResponse(staff);
    }

    private Staff findStaff(UUID id) {
        return staffRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Không tìm thấy nhân viên hành chính"));
    }

    private Staff findCurrentStaff(String username) {
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new ResourceNotFoundException("Không tìm thấy tài khoản"));
        Employee employee = employeeRepository.findByPersonPersonId(user.getPerson().getPersonId())
                .orElseThrow(() -> new ResourceNotFoundException("Tài khoản hiện tại không có hồ sơ nhân viên"));
        return staffRepository.findByEmployeeIdAndDeletedAtIsNull(employee.getEmployeeId())
                .orElseThrow(() -> new ResourceNotFoundException("Tài khoản hiện tại không phải nhân viên hành chính"));
    }

    private boolean existsActiveReference(String tableName, String idColumn, UUID id) {
        Number count = (Number) entityManager.createNativeQuery(
                        "SELECT COUNT(1) FROM " + tableName + " WHERE " + idColumn + " = :id AND IsActive = 1")
                .setParameter("id", id)
                .getSingleResult();
        return count.longValue() > 0;
    }

    private void updatePersonForAdmin(Person person, StaffAdminUpdateRequest request) {
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

    private void updatePersonForSelf(Person person, StaffSelfUpdateRequest request) {
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

    private StaffAdminResponse toAdminResponse(Staff staff) {
        Employee employee = staff.getEmployee();
        Person person = employee.getPerson();
        StaffAdminResponse response = new StaffAdminResponse();
        response.setEmployeeId(employee.getEmployeeId());
        response.setEmployeeCode(employee.getEmployeeCode());
        response.setStaffCode(staff.getStaffCode());
        response.setStartWorkDate(employee.getStartWorkDate());
        response.setEndWorkDate(employee.getEndWorkDate());
        response.setEmployeeStatus(employee.getStatus());
        response.setEmployeeType(employee.getEmployeeType());
        response.setContractType(employee.getContractType());
        response.setNote(employee.getNote());
        response.setDivisionId(staff.getDivisionId());
        response.setPositionId(staff.getPositionId());
        response.setIsActive(staff.getIsActive());
        response.setCreatedAt(staff.getCreatedAt());
        response.setUpdatedAt(staff.getUpdatedAt());
        fillPerson(response, person);
        return response;
    }

    private StaffSelfResponse toSelfResponse(Staff staff) {
        Employee employee = staff.getEmployee();
        Person person = employee.getPerson();
        StaffSelfResponse response = new StaffSelfResponse();
        response.setEmployeeId(employee.getEmployeeId());
        response.setEmployeeCode(employee.getEmployeeCode());
        response.setStaffCode(staff.getStaffCode());
        response.setStartWorkDate(employee.getStartWorkDate());
        response.setEmployeeStatus(employee.getStatus());
        response.setContractType(employee.getContractType());
        response.setDivisionId(staff.getDivisionId());
        response.setPositionId(staff.getPositionId());
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

    private void fillPerson(StaffAdminResponse response, Person person) {
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

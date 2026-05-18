package com.quanlydaotao.backend.employee.service.impl;

import com.quanlydaotao.backend.common.exception.ResourceNotFoundException;
import com.quanlydaotao.backend.employee.dto.EmployeeAdminResponse;
import com.quanlydaotao.backend.employee.entity.Employee;
import com.quanlydaotao.backend.employee.repository.EmployeeRepository;
import com.quanlydaotao.backend.employee.service.EmployeeService;
import com.quanlydaotao.backend.person.entity.Person;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class EmployeeServiceImpl implements EmployeeService {
    private final EmployeeRepository employeeRepository;

    @Override
    @Transactional(readOnly = true)
    public List<EmployeeAdminResponse> getAllEmployeesForAdmin() {
        return employeeRepository.findAll().stream()
                .map(this::toAdminResponse)
                .toList();
    }

    @Override
    @Transactional(readOnly = true)
    public EmployeeAdminResponse getEmployeeForAdmin(UUID id) {
        return toAdminResponse(findEmployee(id));
    }

    private Employee findEmployee(UUID id) {
        return employeeRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Không tìm thấy nhân viên"));
    }

    private EmployeeAdminResponse toAdminResponse(Employee employee) {
        Person person = employee.getPerson();
        EmployeeAdminResponse response = new EmployeeAdminResponse();
        response.setEmployeeId(employee.getEmployeeId());
        response.setEmployeeCode(employee.getEmployeeCode());
        response.setStartWorkDate(employee.getStartWorkDate());
        response.setEndWorkDate(employee.getEndWorkDate());
        response.setStatus(employee.getStatus());
        response.setEmployeeType(employee.getEmployeeType());
        response.setContractType(employee.getContractType());
        response.setNote(employee.getNote());
        response.setIsActive(employee.getIsActive());
        response.setCreatedAt(employee.getCreatedAt());
        response.setUpdatedAt(employee.getUpdatedAt());
        response.setDeletedAt(employee.getDeletedAt());
        fillPerson(response, person);
        return response;
    }

    private void fillPerson(EmployeeAdminResponse response, Person person) {
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

package com.quanlydaotao.backend.person.service;

import com.quanlydaotao.backend.common.exception.ResourceNotFoundException;
import com.quanlydaotao.backend.person.dto.PersonAdminResponse;
import com.quanlydaotao.backend.person.entity.Person;
import com.quanlydaotao.backend.person.repository.PersonRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.UUID;

@Service
@RequiredArgsConstructor
public class PersonService {
    private final PersonRepository personRepository;

    @Transactional(readOnly = true)
    public Page<PersonAdminResponse> getPersonsForAdmin(String keyword, Pageable pageable) {
        return personRepository.searchPersons(keyword, pageable).map(this::toAdminResponse);
    }

    @Transactional(readOnly = true)
    public PersonAdminResponse getPersonForAdmin(UUID id) {
        return toAdminResponse(findPerson(id));
    }

    private Person findPerson(UUID id) {
        return personRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Không tìm thấy thông tin cá nhân"));
    }

    private PersonAdminResponse toAdminResponse(Person person) {
        PersonAdminResponse response = new PersonAdminResponse();
        fillCommon(response, person);
        response.setIsActive(person.getIsActive());
        response.setCreatedAt(person.getCreatedAt());
        response.setUpdatedAt(person.getUpdatedAt());
        response.setDeletedAt(person.getDeletedAt());
        return response;
    }

    private void fillCommon(PersonAdminResponse response, Person person) {
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
        response.setNote(person.getNote());
    }
}

package com.quanlydaotao.backend.user.mapper;

import com.quanlydaotao.backend.user.dto.request.CreatePersonRequest;
import com.quanlydaotao.backend.user.dto.response.PersonResponse;
import com.quanlydaotao.backend.user.entity.Person;
import org.springframework.stereotype.Component;

@Component
public class PersonMapper {

    public Person toEntity(CreatePersonRequest request) {

        Person person = new Person();

        person.setFullName(request.getFullName());
        person.setGender(request.getGender());
        person.setDateOfBirth(request.getDateOfBirth());
        person.setPlaceOfBirth(request.getPlaceOfBirth());
        person.setEthnicity(request.getEthnicity());
        person.setPersonalIdentificationNumber(request.getPersonalIdentificationNumber());
        person.setDateOfIssue(request.getDateOfIssue());
        person.setCardPlace(request.getCardPlace());
        person.setNationality(request.getNationality());
        person.setContactEmail(request.getContactEmail());
        person.setPhoneNumber(request.getPhoneNumber());
        person.setPermanentAddress(request.getPermanentAddress());
        person.setTemporaryAddress(request.getTemporaryAddress());
        person.setAvatarUrl(request.getAvatarUrl());
        person.setNote(request.getNote());

        return person;
    }

    public PersonResponse toResponse(Person person) {

        PersonResponse response = new PersonResponse();

        response.setPersonId(person.getPersonId());
        response.setFullName(person.getFullName());
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

        return response;
    }
}
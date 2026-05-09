package com.quanlydaotao.backend.user.service.impl;

import com.quanlydaotao.backend.common.exception.ResourceNotFoundException;
import com.quanlydaotao.backend.user.dto.request.CreatePersonRequest;
import com.quanlydaotao.backend.user.dto.request.UpdatePersonRequest;
import com.quanlydaotao.backend.user.dto.response.PersonResponse;
import com.quanlydaotao.backend.user.entity.Person;
import com.quanlydaotao.backend.user.mapper.PersonMapper;
import com.quanlydaotao.backend.user.repository.PersonRepository;
import com.quanlydaotao.backend.user.service.PersonService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class PersonServiceImpl implements PersonService {

    private final PersonRepository personRepository;
    private final PersonMapper personMapper;

    @Override
    public PersonResponse create(CreatePersonRequest request) {

        Person person = personMapper.toEntity(request);

        return personMapper.toResponse(
                personRepository.save(person)
        );
    }

    @Override
    public PersonResponse update(UUID personId, UpdatePersonRequest request) {

        Person person = personRepository.findById(personId)
                .orElseThrow(() ->
                        new ResourceNotFoundException("Person not found")
                );

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

        return personMapper.toResponse(
                personRepository.save(person)
        );
    }

    @Override
    public PersonResponse getById(UUID personId) {

        Person person = personRepository.findById(personId)
                .orElseThrow(() ->
                        new ResourceNotFoundException("Person not found")
                );

        return personMapper.toResponse(person);
    }

    @Override
    public List<PersonResponse> getAll() {

        return personRepository.findAll()
                .stream()
                .map(personMapper::toResponse)
                .toList();
    }

    @Override
    public void delete(UUID personId) {

        Person person = personRepository.findById(personId)
                .orElseThrow(() ->
                        new ResourceNotFoundException("Person not found")
                );

        personRepository.delete(person);
    }
}
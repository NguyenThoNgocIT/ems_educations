package com.quanlydaotao.backend.user.service;
import com.quanlydaotao.backend.user.dto.CreatePersonRequest;
import com.quanlydaotao.backend.user.dto.PersonDto;
import com.quanlydaotao.backend.user.dto.UpdatePersonRequest;
import com.quanlydaotao.backend.user.entity.Person;
import com.quanlydaotao.backend.user.repository.PersonRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.time.LocalDateTime;
import java.util.UUID;
@Service
@RequiredArgsConstructor
public class PersonService {
    private final PersonRepository personRepository;
    private PersonDto mapToDto(Person person) {
        PersonDto dto = new PersonDto();
        dto.setPersonId(person.getPersonId());
        dto.setFullName(person.getFullName());
        dto.setGender(person.getGender());
        dto.setDateOfBirth(person.getDateOfBirth());
        dto.setPlaceOfBirth(person.getPlaceOfBirth());
        dto.setEthnicity(person.getEthnicity());
        dto.setPersonalIdentificationNumber(person.getPersonalIdentificationNumber());
        dto.setDateOfIssue(person.getDateOfIssue());
        dto.setCardPlace(person.getCardPlace());
        dto.setNationality(person.getNationality());
        dto.setContactEmail(person.getContactEmail());
        dto.setPhoneNumber(person.getPhoneNumber());
        dto.setPermanentAddress(person.getPermanentAddress());
        dto.setTemporaryAddress(person.getTemporaryAddress());
        dto.setAvatarUrl(person.getAvatarUrl());
        dto.setNote(person.getNote());
        return dto;
    }
    @Transactional(readOnly = true)
    public Page<PersonDto> getPersons(String keyword, Pageable pageable) {
        return personRepository.searchPersons(keyword, pageable).map(this::mapToDto);
    }
    @Transactional(readOnly = true)
    public PersonDto getPersonId(UUID id) {
        return personRepository.findById(id).map(this::mapToDto).orElseThrow(() -> new RuntimeException("Khng tm thy thng tin."));
    }
    @Transactional
    public PersonDto createPerson(CreatePersonRequest request) {
        Person person = new Person();
        person.setFullName(request.getFullName());
        person.setGender(request.getGender());
        person.setDateOfBirth(request.getDateOfBirth());
        person.setContactEmail(request.getContactEmail());
        person.setPhoneNumber(request.getPhoneNumber());
        person.setPersonalIdentificationNumber(request.getPersonalIdentificationNumber());
        return mapToDto(personRepository.save(person));
    }
    @Transactional
    public PersonDto updatePerson(UUID id, UpdatePersonRequest request) {
        Person person = personRepository.findById(id).orElseThrow();
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
        return mapToDto(personRepository.save(person));
    }
    @Transactional
    public void deletePerson(UUID id) {
        Person person = personRepository.findById(id).orElseThrow();
        person.setDeletedAt(LocalDateTime.now());
        person.setIsActive(false);
        personRepository.save(person);
    }
}

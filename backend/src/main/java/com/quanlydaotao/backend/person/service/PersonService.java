package com.quanlydaotao.backend.person.service;

import com.quanlydaotao.backend.common.exception.ResourceNotFoundException;
import com.quanlydaotao.backend.person.dto.PersonAdminResponse;
import com.quanlydaotao.backend.person.entity.Person;
import com.quanlydaotao.backend.person.mapper.PersonMapper;
import com.quanlydaotao.backend.person.repository.PersonRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.util.StringUtils;

import java.util.UUID;

@Service
@RequiredArgsConstructor
public class PersonService {
    private final PersonRepository personRepository;
    private final PersonMapper personMapper;

    @Transactional(readOnly = true)
    public Page<PersonAdminResponse> getPersonsForAdmin(String keyword, Pageable pageable) {
        Page<Person> persons = StringUtils.hasText(keyword)
                ? personRepository.searchPersons(keyword.trim(), pageable)
                : personRepository.findAll(pageable);
        return persons.map(personMapper::toDto);
    }

    @Transactional(readOnly = true)
    public PersonAdminResponse getPersonForAdmin(UUID id) {
        return personMapper.toDto(findPerson(id));
    }

    private Person findPerson(UUID id) {
        return personRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Không tìm thấy thông tin cá nhân"));
    }

}

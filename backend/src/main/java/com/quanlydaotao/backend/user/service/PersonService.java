package com.quanlydaotao.backend.user.service;

import com.quanlydaotao.backend.user.dto.request.CreatePersonRequest;
import com.quanlydaotao.backend.user.dto.request.UpdatePersonRequest;
import com.quanlydaotao.backend.user.dto.response.PersonResponse;

import java.util.List;
import java.util.UUID;

public interface PersonService {

    PersonResponse create(CreatePersonRequest request);

    PersonResponse update(UUID personId, UpdatePersonRequest request);

    PersonResponse getById(UUID personId);

    List<PersonResponse> getAll();

    void delete(UUID personId);
}
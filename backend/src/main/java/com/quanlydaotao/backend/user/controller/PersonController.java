package com.quanlydaotao.backend.user.controller;

import com.quanlydaotao.backend.common.dto.ApiResponse;
import com.quanlydaotao.backend.user.dto.request.CreatePersonRequest;
import com.quanlydaotao.backend.user.dto.request.UpdatePersonRequest;
import com.quanlydaotao.backend.user.dto.response.PersonResponse;
import com.quanlydaotao.backend.user.service.PersonService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/v1/persons")
@RequiredArgsConstructor
public class PersonController {

    private final PersonService personService;

    @PostMapping
    public ApiResponse<PersonResponse> create(
            @RequestBody CreatePersonRequest request
    ) {

        return ApiResponse.success(
                personService.create(request)
        );
    }

    @GetMapping
    public ApiResponse<List<PersonResponse>> getAll() {

        return ApiResponse.success(
                personService.getAll()
        );
    }

    @GetMapping("/{id}")
    public ApiResponse<PersonResponse> getById(
            @PathVariable UUID id
    ) {

        return ApiResponse.success(
                personService.getById(id)
        );
    }

    @PutMapping("/{id}")
    public ApiResponse<PersonResponse> update(
            @PathVariable UUID id,
            @RequestBody UpdatePersonRequest request
    ) {

        return ApiResponse.success(
                personService.update(id, request)
        );
    }

    @DeleteMapping("/{id}")
    public ApiResponse<Void> delete(
            @PathVariable UUID id
    ) {

        personService.delete(id);

        return ApiResponse.success(null);
    }
}
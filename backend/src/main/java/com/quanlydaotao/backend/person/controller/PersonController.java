package com.quanlydaotao.backend.person.controller;
import com.quanlydaotao.backend.common.dto.ApiResponse;
import com.quanlydaotao.backend.person.dto.CreatePersonRequest;
import com.quanlydaotao.backend.person.dto.PersonDto;
import com.quanlydaotao.backend.person.dto.UpdatePersonRequest;
import com.quanlydaotao.backend.person.service.PersonService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.UUID;
@RestController
@RequestMapping("/api/v1/persons")
@RequiredArgsConstructor
public class PersonController {
    private final PersonService personService;
    @GetMapping
    public ResponseEntity<ApiResponse<Page<PersonDto>>> getPersons(
            @RequestParam(required = false) String keyword,
            Pageable pageable) {
        return ResponseEntity.ok(ApiResponse.success(personService.getPersons(keyword, pageable)));
    }
    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<PersonDto>> getPerson(@PathVariable UUID id) {
        return ResponseEntity.ok(ApiResponse.success(personService.getPersonId(id)));
    }
    @PostMapping
    public ResponseEntity<ApiResponse<PersonDto>> createPerson(@RequestBody CreatePersonRequest request) {
        return ResponseEntity.ok(ApiResponse.success(personService.createPerson(request)));
    }
    @PutMapping("/{id}")
    public ResponseEntity<ApiResponse<PersonDto>> updatePerson(@PathVariable UUID id, @RequestBody UpdatePersonRequest request) {
        return ResponseEntity.ok(ApiResponse.success(personService.updatePerson(id, request)));
    }
    @DeleteMapping("/{id}")
    public ResponseEntity<ApiResponse<Void>> deletePerson(@PathVariable UUID id) {
        personService.deletePerson(id);
        return ResponseEntity.ok(ApiResponse.success(null));
    }
}




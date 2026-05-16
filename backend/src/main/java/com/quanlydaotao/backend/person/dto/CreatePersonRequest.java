package com.quanlydaotao.backend.person.dto;
import com.quanlydaotao.backend.person.entity.Person;
import lombok.Data;
import java.time.LocalDate;
@Data public class CreatePersonRequest { private String fullName; private String gender; private LocalDate dateOfBirth; private String contactEmail; private String phoneNumber; private String personalIdentificationNumber; }


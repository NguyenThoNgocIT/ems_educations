package com.quanlydaotao.backend.user.entity;

import com.quanlydaotao.backend.infrastructure.persistence.base.SoftDeleteEntity;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDate;
import java.util.UUID;

@Entity
@Table(name = "Persons")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class Person extends SoftDeleteEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    @Column(name = "PersonId", columnDefinition = "uniqueidentifier", updatable = false, nullable = false)
    private UUID personId;

    @Column(name = "FullName", nullable = false, length = 150)
    private String fullName;

    @Column(name = "Gender", length = 20)
    private String gender;

    @Column(name = "DateOfBirth")
    private LocalDate dateOfBirth;

    @Column(name = "PlaceOfBirth", length = 150)
    private String placeOfBirth;

    @Column(name = "Ethnicity", length = 100)
    private String ethnicity;

    @Column(name = "PersonalIdentificationNumber", length = 20)
    private String personalIdentificationNumber;

    @Column(name = "DateOfIssue")
    private LocalDate dateOfIssue;

    @Column(name = "CardPlace", length = 100)
    private String cardPlace;

    @Column(name = "Nationality", length = 100)
    private String nationality;

    @Column(name = "ContactEmail", length = 150)
    private String contactEmail;

    @Column(name = "PhoneNumber", length = 20)
    private String phoneNumber;

    @Column(name = "PermanentAddress", length = 255)
    private String permanentAddress;

    @Column(name = "TemporaryAddress", length = 255)
    private String temporaryAddress;

    @Column(name = "AvatarUrl", length = 255)
    private String avatarUrl;

    @Column(name = "Note", length = 255)
    private String note;
}



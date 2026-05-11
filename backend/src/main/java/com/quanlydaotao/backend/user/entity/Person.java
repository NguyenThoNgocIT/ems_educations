package com.quanlydaotao.backend.user.entity;

import com.quanlydaotao.backend.infrastructure.persistence.base.SoftDeleteEntity;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.hibernate.annotations.GenericGenerator;

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
    @GeneratedValue(generator = "UUID")
    @GenericGenerator(name = "UUID", strategy = "org.hibernate.id.UUIDGenerator")
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

    @Column(name = "IsActive", nullable = false)
    private Boolean isActive = true;
}
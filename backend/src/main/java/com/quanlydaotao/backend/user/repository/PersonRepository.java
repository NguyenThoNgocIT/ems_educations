package com.quanlydaotao.backend.user.repository;

import com.quanlydaotao.backend.user.entity.Person;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.stereotype.Repository;

import java.util.Optional;
import java.util.UUID;

@Repository
public interface PersonRepository extends JpaRepository<Person, UUID>,
        JpaSpecificationExecutor<Person> {

    /*
     * =========================
     * EXISTS VALIDATION
     * =========================
     */

    boolean existsByContactEmail(String contactEmail);

    boolean existsByPhoneNumber(String phoneNumber);

    boolean existsByPersonalIdentificationNumber(String personalIdentificationNumber);

    /*
     * =========================
     * FIND DATA
     * =========================
     */

    Optional<Person> findByContactEmail(String contactEmail);

    Optional<Person> findByPhoneNumber(String phoneNumber);

    Optional<Person> findByPersonalIdentificationNumber(String personalIdentificationNumber);

    /*
     * =========================
     * ACTIVE DATA
     * =========================
     */

    boolean existsByContactEmailAndIsActiveTrue(String contactEmail);

    boolean existsByPhoneNumberAndIsActiveTrue(String phoneNumber);

    /*
     * =========================
     * SOFT DELETE SUPPORT
     * =========================
     */

    Optional<Person> findByPersonIdAndDeletedAtIsNull(UUID personId);
}
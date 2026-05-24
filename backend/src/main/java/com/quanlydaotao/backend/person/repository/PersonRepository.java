package com.quanlydaotao.backend.person.repository;

import com.quanlydaotao.backend.person.entity.Person;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.UUID;

@Repository
public interface PersonRepository extends JpaRepository<Person, UUID> {
    @Query("SELECT p FROM Person p WHERE LOWER(p.fullName) LIKE LOWER(CONCAT('%', CAST(:keyword AS String), '%')) OR LOWER(p.contactEmail) LIKE LOWER(CONCAT('%', CAST(:keyword AS String), '%'))")
    Page<Person> searchPersons(@Param("keyword") String keyword, Pageable pageable);
}



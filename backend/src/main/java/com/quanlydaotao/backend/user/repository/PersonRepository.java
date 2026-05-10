package com.quanlydaotao.backend.user.repository;

import com.quanlydaotao.backend.user.entity.Person;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.UUID;

@Repository
public interface PersonRepository extends JpaRepository<Person, UUID> {
    @Query("SELECT p FROM Person p WHERE (:keyword IS NULL OR LOWER(p.fullName) LIKE LOWER(CONCAT('%', :keyword, '%')) OR LOWER(p.contactEmail) LIKE LOWER(CONCAT('%', :keyword, '%')))")
    Page<Person> searchPersons(@Param("keyword") String keyword, Pageable pageable);
}

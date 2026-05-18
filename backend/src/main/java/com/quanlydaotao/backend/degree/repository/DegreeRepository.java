package com.quanlydaotao.backend.degree.repository;

import com.quanlydaotao.backend.degree.entity.Degree;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.UUID;

@Repository
public interface DegreeRepository extends JpaRepository<Degree, UUID> {
}


package com.quanlydaotao.backend.course.repository;

import com.quanlydaotao.backend.course.entity.Major;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.UUID;

@Repository
public interface MajorRepository extends JpaRepository<Major, UUID> {
}

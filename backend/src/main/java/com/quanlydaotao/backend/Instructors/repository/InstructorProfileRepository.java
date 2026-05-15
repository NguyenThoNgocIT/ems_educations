package com.quanlydaotao.backend.Instructors.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.quanlydaotao.backend.Instructors.entity.InstructorProfile;

import java.util.Optional;
import java.util.UUID;

@Repository
public interface InstructorProfileRepository extends JpaRepository<InstructorProfile, UUID> {
    Optional<InstructorProfile> findByInstructorCode(String instructorCode);

    // Sửa: employee là tên field, employeeId là tên field ID trong Employee
    Optional<InstructorProfile> findByEmployeeEmployeeId(UUID employeeId);
    // HOẶC nếu Employee có field tên là "id"
    // Optional<LecturerProfile> findByEmployeeId(UUID id);
}
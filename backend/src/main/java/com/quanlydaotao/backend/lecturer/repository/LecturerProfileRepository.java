package com.quanlydaotao.backend.lecturer.repository;
import com.quanlydaotao.backend.lecturer.entity.LecturerProfile;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.Optional;
import java.util.UUID;
@Repository
public interface LecturerProfileRepository extends JpaRepository<LecturerProfile, UUID> {
    Optional<LecturerProfile> findByInstructorCode(String instructorCode);
    Optional<LecturerProfile> findByEmployeeId(UUID employeeId);
}


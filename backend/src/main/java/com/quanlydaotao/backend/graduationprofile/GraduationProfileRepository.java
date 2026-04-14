package com.quanlydaotao.backend.graduationprofile;

import java.util.List;
import java.util.Optional;
import java.util.UUID;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface GraduationProfileRepository extends JpaRepository<GraduationProfile, UUID> {

    Optional<GraduationProfile> findByIdAndIsActiveTrue(UUID id);

    List<GraduationProfile> findByIsActiveTrue();

    List<GraduationProfile> findByProfileCodeContainingIgnoreCaseAndIsActiveTrue(String profileCode);

    List<GraduationProfile> findByStudentIdAndIsActiveTrue(UUID studentId);

    List<GraduationProfile> findByStatusAndIsActiveTrue(String status);
}

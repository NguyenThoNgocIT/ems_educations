package com.quanlydaotao.backend.graduationresult;

import java.util.List;
import java.util.Optional;
import java.util.UUID;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface GraduationResultRepository extends JpaRepository<GraduationResult, UUID> {

    Optional<GraduationResult> findByIdAndIsActiveTrue(UUID id);

    List<GraduationResult> findByIsActiveTrue();

    List<GraduationResult> findByStudentIdAndIsActiveTrue(UUID studentId);

    List<GraduationResult> findByGraduationStatusAndIsActiveTrue(String graduationStatus);

    List<GraduationResult> findByGraduationRankAndIsActiveTrue(String graduationRank);

    List<GraduationResult> findByDecisionNumberContainingIgnoreCaseAndIsActiveTrue(String decisionNumber);
}

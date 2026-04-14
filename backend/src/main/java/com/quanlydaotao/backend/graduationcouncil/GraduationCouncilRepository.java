package com.quanlydaotao.backend.graduationcouncil;

import java.util.List;
import java.util.Optional;
import java.util.UUID;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface GraduationCouncilRepository extends JpaRepository<GraduationCouncil, UUID> {

    Optional<GraduationCouncil> findByCouncilCode(String councilCode);

    Optional<GraduationCouncil> findByIdAndIsActiveTrue(UUID id);

    List<GraduationCouncil> findByIsActiveTrue();

    List<GraduationCouncil> findByCouncilCodeContainingIgnoreCaseOrCouncilNameContainingIgnoreCaseAndIsActiveTrue(
            String councilCode,
            String councilName
    );

    List<GraduationCouncil> findBySchoolYearAndIsActiveTrue(String schoolYear);

    List<GraduationCouncil> findBySemesterAndIsActiveTrue(String semester);
}

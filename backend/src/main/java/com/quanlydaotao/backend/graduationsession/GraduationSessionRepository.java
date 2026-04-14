package com.quanlydaotao.backend.graduationsession;

import java.util.List;
import java.util.Optional;
import java.util.UUID;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface GraduationSessionRepository extends JpaRepository<GraduationSession, UUID> {

    Optional<GraduationSession> findBySessionCode(String sessionCode);

    Optional<GraduationSession> findByIdAndIsActiveTrue(UUID id);

    List<GraduationSession> findByIsActiveTrue();

    List<GraduationSession> findBySessionCodeContainingIgnoreCaseOrSessionNameContainingIgnoreCaseAndIsActiveTrue(
            String sessionCode,
            String sessionName
    );

    List<GraduationSession> findByStartDateLessThanEqualAndDueDateGreaterThanEqualAndIsActiveTrue(
            java.time.LocalDate startDate,
            java.time.LocalDate dueDate
    );
}

package com.quanlydaotao.backend.registrationperiod.repository;

import com.quanlydaotao.backend.registrationperiod.entity.RegistrationPeriod;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Repository
public interface RegistrationPeriodRepository extends JpaRepository<RegistrationPeriod, UUID> {
    @Query("""
            SELECT p
            FROM RegistrationPeriod p
            WHERE p.semesterId = :semesterId
              AND p.isActive = true
              AND (p.status IS NULL OR p.status = 1)
              AND p.allowRetake = true
              AND p.startDate <= :now
              AND p.endDate >= :now
            ORDER BY p.startDate DESC
            """)
    Optional<RegistrationPeriod> findActivePeriod(UUID semesterId, LocalDateTime now);

    @Query("""
            SELECT p
            FROM RegistrationPeriod p
            WHERE p.isActive = true
              AND (p.status IS NULL OR p.status = 1)
              AND p.allowRetake = true
              AND p.startDate <= :now
              AND p.endDate >= :now
              AND (:semesterId IS NULL OR p.semesterId = :semesterId)
            ORDER BY p.startDate DESC
            """)
    List<RegistrationPeriod> findActiveRetakePeriods(UUID semesterId, LocalDateTime now);
}

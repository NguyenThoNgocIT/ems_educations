package com.quanlydaotao.backend.schedule;

import java.util.List;
import java.util.Optional;
import java.util.UUID;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

@Repository
public interface ScheduleRepository extends JpaRepository<Schedule, UUID> {

    Optional<Schedule> findByIdAndIsActiveTrue(UUID id);

    List<Schedule> findByIsActiveTrue();

    List<Schedule> findByCourseClassIdAndIsActiveTrue(UUID courseClassId);

    List<Schedule> findByRoomIdAndIsActiveTrue(UUID roomId);

    List<Schedule> findBySemesterIdAndIsActiveTrue(UUID semesterId);

    List<Schedule> findByDayOfWeekAndIsActiveTrue(Integer dayOfWeek);

    @Query("SELECT s FROM Schedule s WHERE s.isActive = true AND s.roomId = :roomId AND s.semesterId = :semesterId AND s.dayOfWeek = :dayOfWeek"
            + " AND NOT (s.endPeriod < :startPeriod OR s.startPeriod > :endPeriod)")
    List<Schedule> findOverlappingSchedules(
            @Param("roomId") UUID roomId,
            @Param("semesterId") UUID semesterId,
            @Param("dayOfWeek") Integer dayOfWeek,
            @Param("startPeriod") Integer startPeriod,
            @Param("endPeriod") Integer endPeriod
    );
}

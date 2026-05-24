package com.quanlydaotao.backend.scheduling.repository;

import com.quanlydaotao.backend.scheduling.entity.Schedule;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Repository
public interface ScheduleRepository extends JpaRepository<Schedule, UUID> {

    // 🕵️ Kiểm tra trùng phòng
    boolean existsByRoomRoomIdAndSemesterIdAndDayOfWeekAndTimeSlotTimeSlotIdAndScheduleIdNot(
            UUID roomId, UUID semesterId, Integer dayOfWeek, UUID timeSlotId, UUID scheduleId);

    // 🕵️ Kiểm tra trùng lớp
    boolean existsByCourseClassCourseClassIdAndSemesterIdAndDayOfWeekAndTimeSlotTimeSlotIdAndScheduleIdNot(
            UUID courseClassId, UUID semesterId, Integer dayOfWeek, UUID timeSlotId, UUID scheduleId);

    // 🕵️ Kiểm tra trùng giảng viên
    boolean existsByInstructorEmployeeIdAndSemesterIdAndDayOfWeekAndTimeSlotTimeSlotIdAndScheduleIdNot(
            UUID instructorId, UUID semesterId, Integer dayOfWeek, UUID timeSlotId, UUID scheduleId);

    boolean existsByCourseClassCourseClassId(UUID courseClassId);

    List<Schedule> findByCourseClassCourseClassId(UUID courseClassId);
    
    List<Schedule> findByInstructorEmployeeId(UUID instructorId);
    
    List<Schedule> findByRoomRoomId(UUID roomId);

    List<Schedule> findByInstructorEmployeeIdAndDateBetweenAndIsActiveTrueOrderByDateAsc(UUID instructorId, LocalDate fromDate, LocalDate toDate);

    List<Schedule> findByCourseClassCourseClassIdAndDateBetweenAndIsActiveTrueOrderByDateAsc(UUID courseClassId, LocalDate fromDate, LocalDate toDate);

    List<Schedule> findBySemesterIdAndIsActiveTrue(UUID semesterId);

    @Query("""
            SELECT s
            FROM Schedule s
            WHERE s.courseClass.courseClassId = :courseClassId
              AND s.isActive = true
              AND (s.scheduleType IS NULL OR s.scheduleType = 'FIXED')
              AND (:fromDate IS NULL OR s.date >= :fromDate)
              AND (:toDate IS NULL OR s.date <= :toDate)
              AND (s.scheduleStatus IS NULL OR s.scheduleStatus NOT IN ('CANCELLED','ABSENT'))
            ORDER BY s.date ASC, s.dayOfWeek ASC
            """)
    List<Schedule> findFixedSessions(UUID courseClassId, LocalDate fromDate, LocalDate toDate);

    @Query("""
            SELECT s
            FROM Schedule s
            WHERE s.instructor.employeeId = :instructorId
              AND s.semesterId = :semesterId
              AND s.isActive = true
              AND (s.scheduleType IS NULL OR s.scheduleType = 'FIXED')
            ORDER BY s.courseClass.classCode ASC, s.date ASC, s.dayOfWeek ASC
            """)
    List<Schedule> findFixedByInstructorAndSemester(UUID instructorId, UUID semesterId);

    @Query("""
            SELECT s
            FROM Schedule s
            WHERE s.courseClass.courseClassId = :courseClassId
              AND s.date = :date
              AND s.timeSlot.timeSlotId = :timeSlotId
              AND s.isActive = true
              AND (s.scheduleType IS NULL OR s.scheduleType = 'FIXED')
              AND (s.scheduleStatus IS NULL OR s.scheduleStatus NOT IN ('CANCELLED','ABSENT'))
            """)
    Optional<Schedule> findFixedSession(UUID courseClassId, LocalDate date, UUID timeSlotId);

    @Query("""
            SELECT COUNT(s) > 0
            FROM Schedule s
            WHERE s.instructor.employeeId = :instructorId
              AND s.date = :date
              AND s.timeSlot.timeSlotId = :timeSlotId
              AND s.isActive = true
              AND (s.scheduleStatus IS NULL OR s.scheduleStatus <> 'CANCELLED')
              AND (:ignoredCourseClassId IS NULL OR s.courseClass.courseClassId <> :ignoredCourseClassId)
            """)
    boolean hasInstructorConflict(UUID instructorId, LocalDate date, UUID timeSlotId, UUID ignoredCourseClassId);

    @Query("""
            SELECT COUNT(s) > 0
            FROM Schedule s
            WHERE s.room.roomId = :roomId
              AND s.date = :date
              AND s.timeSlot.timeSlotId = :timeSlotId
              AND s.isActive = true
              AND (s.scheduleStatus IS NULL OR s.scheduleStatus <> 'CANCELLED')
            """)
    boolean hasRoomConflict(UUID roomId, LocalDate date, UUID timeSlotId);

    @Query("""
            SELECT COUNT(s) > 0
            FROM Schedule s
            WHERE s.courseClass.courseClassId = :courseClassId
              AND s.date = :date
              AND s.timeSlot.timeSlotId = :timeSlotId
              AND s.isActive = true
              AND (s.scheduleStatus IS NULL OR s.scheduleStatus <> 'CANCELLED')
            """)
    boolean hasCourseClassConflict(UUID courseClassId, LocalDate date, UUID timeSlotId);
}

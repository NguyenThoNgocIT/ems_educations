package com.quanlydaotao.backend.scheduling.repository;

import com.quanlydaotao.backend.scheduling.entity.Schedule;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
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

    List<Schedule> findByCourseClassCourseClassId(UUID courseClassId);
    
    List<Schedule> findByInstructorEmployeeId(UUID instructorId);
    
    List<Schedule> findByRoomRoomId(UUID roomId);
}

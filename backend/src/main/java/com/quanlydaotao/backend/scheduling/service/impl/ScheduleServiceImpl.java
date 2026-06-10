package com.quanlydaotao.backend.scheduling.service.impl;

import com.quanlydaotao.backend.common.exception.BusinessException;
import com.quanlydaotao.backend.common.exception.ResourceNotFoundException;
import com.quanlydaotao.backend.course.repository.CourseClassRepository;
import com.quanlydaotao.backend.employeeleave.repository.EmployeeLeaveRequestRepository;
import com.quanlydaotao.backend.facility.repository.RoomRepository;
import com.quanlydaotao.backend.scheduling.dto.ScheduleDto;
import com.quanlydaotao.backend.scheduling.entity.Schedule;
import com.quanlydaotao.backend.scheduling.mapper.ScheduleMapper;
import com.quanlydaotao.backend.scheduling.repository.ScheduleRepository;
import com.quanlydaotao.backend.scheduling.repository.TimeSlotRepository;
import com.quanlydaotao.backend.scheduling.service.ScheduleService;
import com.quanlydaotao.backend.employee.repository.EmployeeRepository;
import com.quanlydaotao.backend.teachingassignment.repository.TeachingAssignmentRepository;
import com.quanlydaotao.backend.administrativeclass.entity.AdministrativeClass;
import com.quanlydaotao.backend.administrativeclass.repository.AdministrativeClassRepository;
import com.quanlydaotao.backend.teachingassignment.entity.TeachingAssignment;
import com.quanlydaotao.backend.course.entity.CourseClass;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class ScheduleServiceImpl implements ScheduleService {

    private final ScheduleRepository scheduleRepository;
    private final CourseClassRepository courseClassRepository;
    private final EmployeeRepository employeeRepository;
    private final RoomRepository roomRepository;
    private final TimeSlotRepository timeSlotRepository;
    private final TeachingAssignmentRepository teachingAssignmentRepository;
    private final EmployeeLeaveRequestRepository employeeLeaveRequestRepository;
    private final ScheduleMapper scheduleMapper;
    private final AdministrativeClassRepository administrativeClassRepository;

    @Override
    public List<ScheduleDto> getAll() {
        return scheduleMapper.toDtoList(scheduleRepository.findAll());
    }

    @Override
    public List<ScheduleDto> getByCourseClass(UUID courseClassId) {
        return scheduleMapper.toDtoList(scheduleRepository.findByCourseClassCourseClassId(courseClassId));
    }

    @Override
    public List<ScheduleDto> getByInstructor(UUID instructorId) {
        return scheduleMapper.toDtoList(scheduleRepository.findByInstructorEmployeeId(instructorId));
    }

    @Override
    public List<ScheduleDto> getByRoom(UUID roomId) {
        return scheduleMapper.toDtoList(scheduleRepository.findByRoomRoomId(roomId));
    }

    @Override
    @Transactional
    public ScheduleDto create(ScheduleDto dto) {
        validateSchedule(dto, UUID.randomUUID()); // Sử dụng random UUID cho create để không bị trùng chính mình
        Schedule schedule = scheduleMapper.toEntity(dto);
        
        // Load các entity liên quan để đảm bảo tồn tại
        CourseClass courseClass = courseClassRepository.findById(dto.getCourseClassId())
                .orElseThrow(() -> new ResourceNotFoundException("Lớp học phần không tồn tại"));
        schedule.setCourseClass(courseClass);
        
        if (dto.getInstructorId() != null) {
            schedule.setInstructor(employeeRepository.findById(dto.getInstructorId())
                    .orElseThrow(() -> new ResourceNotFoundException("Giảng viên không tồn tại")));
        }
        
        schedule.setRoom(roomRepository.findById(dto.getRoomId())
                .orElseThrow(() -> new ResourceNotFoundException("Phòng học không tồn tại")));
        
        schedule.setTimeSlot(timeSlotRepository.findById(dto.getTimeSlotId())
                .orElseThrow(() -> new ResourceNotFoundException("Ca học không tồn tại")));

        Schedule savedFirst = scheduleRepository.save(schedule);

        // TỰ ĐỘNG SINH CÁC BUỔI TIẾP THEO CHO ĐỦ SỐ TIẾT
        double theory = 0.0;
        double practice = 0.0;
        double credits = 3.0;
        if (courseClass.getCourse() != null) {
            theory = courseClass.getCourse().getTheoryHours() != null ? courseClass.getCourse().getTheoryHours() : 0.0;
            practice = courseClass.getCourse().getPracticeHours() != null ? courseClass.getCourse().getPracticeHours() : 0.0;
            credits = courseClass.getCourse().getCredits() != null ? courseClass.getCourse().getCredits() : 3.0;
        }
        int requiredPeriods = (int) Math.max(1, Math.ceil(theory + practice));
        if (requiredPeriods == 0) {
            requiredPeriods = (int) Math.max(1, Math.ceil(credits * 15));
        }

        // Đếm số tiết đã lên lịch trước đó (chỉ đếm các lịch Active)
        List<Schedule> existingSchedules = scheduleRepository.findByCourseClassCourseClassId(courseClass.getCourseClassId());
        int scheduledPeriods = 0;
        for (Schedule s : existingSchedules) {
            if (s.getIsActive() != null && s.getIsActive() && !s.getScheduleId().equals(savedFirst.getScheduleId())) {
                scheduledPeriods += s.getNumberOfPeriods() != null ? s.getNumberOfPeriods() : 0;
            }
        }

        int currentSessionPeriods = savedFirst.getNumberOfPeriods() != null ? savedFirst.getNumberOfPeriods() : 2;
        int totalScheduledAfterFirst = scheduledPeriods + currentSessionPeriods;

        if (totalScheduledAfterFirst < requiredPeriods && savedFirst.getDate() != null) {
            int remainingPeriods = requiredPeriods - totalScheduledAfterFirst;
            int additionalSessions = (int) Math.ceil((double) remainingPeriods / currentSessionPeriods);

            LocalDate baseDate = savedFirst.getDate();
            for (int i = 1; i <= additionalSessions; i++) {
                LocalDate targetDate = baseDate.plusWeeks(i);
                
                int periodsForThisSession = currentSessionPeriods;
                if (i == additionalSessions && (remainingPeriods % currentSessionPeriods != 0)) {
                    periodsForThisSession = remainingPeriods % currentSessionPeriods;
                }

                Schedule nextSchedule = new Schedule();
                nextSchedule.setCourseClass(courseClass);
                nextSchedule.setInstructor(savedFirst.getInstructor());
                nextSchedule.setRoom(savedFirst.getRoom());
                nextSchedule.setTimeSlot(savedFirst.getTimeSlot());
                nextSchedule.setSemesterId(savedFirst.getSemesterId());
                nextSchedule.setDayOfWeek(savedFirst.getDayOfWeek());
                nextSchedule.setDate(targetDate);
                nextSchedule.setNumberOfPeriods(periodsForThisSession);
                nextSchedule.setMode(savedFirst.getMode());
                nextSchedule.setScheduleStatus(savedFirst.getScheduleStatus());
                nextSchedule.setScheduleType(savedFirst.getScheduleType());
                nextSchedule.setShift(savedFirst.getShift());
                nextSchedule.setNote(savedFirst.getNote());
                nextSchedule.setIsActive(true);
                if (savedFirst.getTimeSlot() != null) {
                    nextSchedule.setStartDate(targetDate.atTime(savedFirst.getTimeSlot().getStartTime()));
                    nextSchedule.setEndDate(targetDate.atTime(savedFirst.getTimeSlot().getEndTime()));
                }

                scheduleRepository.save(nextSchedule);
            }
        }

        updateCourseClassDates(courseClass.getCourseClassId());

        return scheduleMapper.toDto(savedFirst);
    }

    @Override
    @Transactional
    public ScheduleDto update(UUID id, ScheduleDto dto) {
        Schedule schedule = scheduleRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Không tìm thấy lịch học"));
        
        UUID oldCourseClassId = schedule.getCourseClass() != null ? schedule.getCourseClass().getCourseClassId() : null;
        
        scheduleMapper.updateEntityFromDto(dto, schedule);
        
        // Cập nhật lại các quan hệ nếu thay đổi ID
        schedule.setCourseClass(courseClassRepository.findById(dto.getCourseClassId())
                .orElseThrow(() -> new ResourceNotFoundException("Lớp học phần không tồn tại")));
        
        if (dto.getInstructorId() != null) {
            schedule.setInstructor(employeeRepository.findById(dto.getInstructorId())
                    .orElseThrow(() -> new ResourceNotFoundException("Giảng viên không tồn tại")));
        } else {
            schedule.setInstructor(null);
        }
        
        schedule.setRoom(roomRepository.findById(dto.getRoomId())
                .orElseThrow(() -> new ResourceNotFoundException("Phòng học không tồn tại")));
        
        schedule.setTimeSlot(timeSlotRepository.findById(dto.getTimeSlotId())
                .orElseThrow(() -> new ResourceNotFoundException("Ca học không tồn tại")));

        Schedule saved = scheduleRepository.save(schedule);
        
        updateCourseClassDates(dto.getCourseClassId());
        if (oldCourseClassId != null && !oldCourseClassId.equals(dto.getCourseClassId())) {
            updateCourseClassDates(oldCourseClassId);
        }

        return scheduleMapper.toDto(saved);
    }

    @Override
    @Transactional
    public void delete(UUID id) {
        Schedule schedule = scheduleRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Không tìm thấy lịch học"));
        UUID courseClassId = schedule.getCourseClass() != null ? schedule.getCourseClass().getCourseClassId() : null;
        scheduleRepository.delete(schedule);
        if (courseClassId != null) {
            updateCourseClassDates(courseClassId);
        }
    }

    private void updateCourseClassDates(UUID courseClassId) {
        if (courseClassId == null) {
            return;
        }
        CourseClass courseClass = courseClassRepository.findById(courseClassId).orElse(null);
        if (courseClass == null) {
            return;
        }
        List<Schedule> schedules = scheduleRepository.findByCourseClassCourseClassId(courseClassId);
        LocalDate minDate = null;
        LocalDate maxDate = null;
        for (Schedule s : schedules) {
            if (Boolean.TRUE.equals(s.getIsActive()) && s.getDate() != null
                    && (s.getScheduleStatus() == null || !s.getScheduleStatus().equals("CANCELLED"))) {
                LocalDate date = s.getDate();
                if (minDate == null || date.isBefore(minDate)) {
                    minDate = date;
                }
                if (maxDate == null || date.isAfter(maxDate)) {
                    maxDate = date;
                }
            }
        }
        courseClass.setStartDate(minDate);
        courseClass.setEndDate(maxDate);
        courseClassRepository.save(courseClass);
    }

    private void validateSchedule(ScheduleDto dto, UUID currentScheduleId) {
        if (dto.getDate() != null) {
            validateScheduleByDate(dto, currentScheduleId);
        }
        if (dto.getDayOfWeek() != null) {
            validateScheduleByDayOfWeek(dto, currentScheduleId);
        }
        validateInstructorAssignmentAndLeave(dto);
    }

    private void validateScheduleByDate(ScheduleDto dto, UUID currentScheduleId) {
        if (scheduleRepository.hasRoomConflictIgnoringSchedule(
                dto.getRoomId(), dto.getDate(), dto.getTimeSlotId(), currentScheduleId)) {
            throw new BusinessException("Phòng học này đã có lịch vào ngày " + dto.getDate() + " tại ca học này.");
        }

        if (scheduleRepository.hasCourseClassConflictIgnoringSchedule(
                dto.getCourseClassId(), dto.getDate(), dto.getTimeSlotId(), currentScheduleId)) {
            throw new BusinessException("Lớp học phần này đã có lịch vào ngày " + dto.getDate() + " tại ca học này.");
        }

        if (dto.getInstructorId() != null && scheduleRepository.hasInstructorConflictIgnoringSchedule(
                dto.getInstructorId(), dto.getDate(), dto.getTimeSlotId(), currentScheduleId)) {
            throw new BusinessException("Giảng viên này đã có lịch dạy vào ngày " + dto.getDate() + " tại ca học này.");
        }
    }

    private void validateScheduleByDayOfWeek(ScheduleDto dto, UUID currentScheduleId) {
        if (scheduleRepository.existsByRoomRoomIdAndSemesterIdAndDayOfWeekAndTimeSlotTimeSlotIdAndScheduleIdNot(
                dto.getRoomId(), dto.getSemesterId(), dto.getDayOfWeek(), dto.getTimeSlotId(), currentScheduleId)) {
            throw new BusinessException("Phòng học này đã có lịch vào Thứ " + dto.getDayOfWeek() + " tại ca học này.");
        }

        if (scheduleRepository.existsByCourseClassCourseClassIdAndSemesterIdAndDayOfWeekAndTimeSlotTimeSlotIdAndScheduleIdNot(
                dto.getCourseClassId(), dto.getSemesterId(), dto.getDayOfWeek(), dto.getTimeSlotId(), currentScheduleId)) {
            throw new BusinessException("Lớp học phần này đã có lịch vào Thứ " + dto.getDayOfWeek() + " tại ca học này.");
        }

        if (dto.getInstructorId() != null && scheduleRepository.existsByInstructorEmployeeIdAndSemesterIdAndDayOfWeekAndTimeSlotTimeSlotIdAndScheduleIdNot(
                dto.getInstructorId(), dto.getSemesterId(), dto.getDayOfWeek(), dto.getTimeSlotId(), currentScheduleId)) {
            throw new BusinessException("Giảng viên này đã có lịch dạy vào Thứ " + dto.getDayOfWeek() + " tại ca học này.");
        }
    }

    private void validateInstructorAssignmentAndLeave(ScheduleDto dto) {
        if (dto.getInstructorId() != null) {
            boolean assigned = teachingAssignmentRepository.existsByInstructorIdAndCourseClassIdAndSemesterIdAndIsActiveTrue(
                    dto.getInstructorId(), dto.getCourseClassId(), dto.getSemesterId());
            if (!assigned) {
                CourseClass courseClass = courseClassRepository.findById(dto.getCourseClassId())
                        .orElseThrow(() -> new ResourceNotFoundException("Lớp học phần không tồn tại"));
                
                UUID classId = administrativeClassRepository.findByClassCode(courseClass.getClassCode())
                        .map(AdministrativeClass::getClassId)
                        .orElseGet(() -> {
                            List<AdministrativeClass> allClasses = administrativeClassRepository.findAll();
                            if (allClasses.isEmpty()) {
                                throw new BusinessException("Không có lớp hành chính nào trong hệ thống để thực hiện phân công");
                            }
                            return allClasses.get(0).getClassId();
                        });

                TeachingAssignment teachingAssignment = new TeachingAssignment();
                teachingAssignment.setInstructorId(dto.getInstructorId());
                teachingAssignment.setCourseClassId(dto.getCourseClassId());
                teachingAssignment.setClassId(classId);
                teachingAssignment.setSemesterId(dto.getSemesterId());
                teachingAssignment.setIsActive(true);
                
                teachingAssignmentRepository.save(teachingAssignment);
            }

            if (dto.getDate() != null
                    && employeeLeaveRequestRepository.hasApprovedLeaveOnDate(dto.getInstructorId(), dto.getDate())) {
                throw new BusinessException("Giảng viên đã có lịch nghỉ được duyệt trong ngày này");
            }
        }
    }
}


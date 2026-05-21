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
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

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
        schedule.setCourseClass(courseClassRepository.findById(dto.getCourseClassId())
                .orElseThrow(() -> new ResourceNotFoundException("Lớp học phần không tồn tại")));
        
        if (dto.getInstructorId() != null) {
            schedule.setInstructor(employeeRepository.findById(dto.getInstructorId())
                    .orElseThrow(() -> new ResourceNotFoundException("Giảng viên không tồn tại")));
        }
        
        schedule.setRoom(roomRepository.findById(dto.getRoomId())
                .orElseThrow(() -> new ResourceNotFoundException("Phòng học không tồn tại")));
        
        schedule.setTimeSlot(timeSlotRepository.findById(dto.getTimeSlotId())
                .orElseThrow(() -> new ResourceNotFoundException("Ca học không tồn tại")));

        return scheduleMapper.toDto(scheduleRepository.save(schedule));
    }

    @Override
    @Transactional
    public ScheduleDto update(UUID id, ScheduleDto dto) {
        Schedule schedule = scheduleRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Không tìm thấy lịch học"));
        
        validateSchedule(dto, id);
        
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

        return scheduleMapper.toDto(scheduleRepository.save(schedule));
    }

    @Override
    @Transactional
    public void delete(UUID id) {
        Schedule schedule = scheduleRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Không tìm thấy lịch học"));
        scheduleRepository.delete(schedule);
    }

    private void validateSchedule(ScheduleDto dto, UUID currentScheduleId) {
        // 1. Kiểm tra trùng phòng
        if (scheduleRepository.existsByRoomRoomIdAndSemesterIdAndDayOfWeekAndTimeSlotTimeSlotIdAndScheduleIdNot(
                dto.getRoomId(), dto.getSemesterId(), dto.getDayOfWeek(), dto.getTimeSlotId(), currentScheduleId)) {
            throw new BusinessException("Phòng học này đã có lịch vào Thứ " + dto.getDayOfWeek() + " tại ca học này.");
        }

        // 2. Kiểm tra trùng lớp học phần
        if (scheduleRepository.existsByCourseClassCourseClassIdAndSemesterIdAndDayOfWeekAndTimeSlotTimeSlotIdAndScheduleIdNot(
                dto.getCourseClassId(), dto.getSemesterId(), dto.getDayOfWeek(), dto.getTimeSlotId(), currentScheduleId)) {
            throw new BusinessException("Lớp học phần này đã có lịch vào Thứ " + dto.getDayOfWeek() + " tại ca học này.");
        }

        // 3. Kiểm tra trùng giảng viên (nếu có gán giảng viên)
        if (dto.getInstructorId() != null && scheduleRepository.existsByInstructorEmployeeIdAndSemesterIdAndDayOfWeekAndTimeSlotTimeSlotIdAndScheduleIdNot(
                dto.getInstructorId(), dto.getSemesterId(), dto.getDayOfWeek(), dto.getTimeSlotId(), currentScheduleId)) {
            throw new BusinessException("Giảng viên này đã có lịch dạy vào Thứ " + dto.getDayOfWeek() + " tại ca học này.");
        }
        validateInstructorAssignmentAndLeave(dto);
    }

    private void validateInstructorAssignmentAndLeave(ScheduleDto dto) {
        if (dto.getInstructorId() != null
                && !teachingAssignmentRepository.existsByInstructorIdAndCourseClassIdAndSemesterIdAndIsActiveTrue(
                dto.getInstructorId(), dto.getCourseClassId(), dto.getSemesterId())) {
            throw new BusinessException("Giảng viên chưa được phân công dạy lớp học phần này");
        }
        if (dto.getInstructorId() != null && dto.getDate() != null
                && employeeLeaveRequestRepository.hasApprovedLeaveOnDate(dto.getInstructorId(), dto.getDate())) {
            throw new BusinessException("Giảng viên đã có lịch nghỉ được duyệt trong ngày này");
        }
    }
}


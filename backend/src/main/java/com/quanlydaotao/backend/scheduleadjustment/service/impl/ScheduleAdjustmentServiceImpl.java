package com.quanlydaotao.backend.scheduleadjustment.service.impl;

import com.quanlydaotao.backend.common.exception.BusinessException;
import com.quanlydaotao.backend.common.exception.ErrorCode;
import com.quanlydaotao.backend.common.exception.ResourceNotFoundException;
import com.quanlydaotao.backend.course.entity.CourseClass;
import com.quanlydaotao.backend.course.repository.CourseClassRepository;
import com.quanlydaotao.backend.employee.entity.Employee;
import com.quanlydaotao.backend.employee.repository.EmployeeRepository;
import com.quanlydaotao.backend.employeeleave.repository.EmployeeLeaveRequestRepository;
import com.quanlydaotao.backend.facility.repository.RoomRepository;
import com.quanlydaotao.backend.instructor.entity.InstructorProfile;
import com.quanlydaotao.backend.instructor.repository.InstructorProfileRepository;
import com.quanlydaotao.backend.scheduleadjustment.dto.ScheduleAdjustmentResponse;
import com.quanlydaotao.backend.scheduleadjustment.dto.ScheduleAdjustmentReviewRequest;
import com.quanlydaotao.backend.scheduleadjustment.dto.ScheduleAdjustmentSubmitRequest;
import com.quanlydaotao.backend.scheduleadjustment.dto.ScheduleAdjustmentValidateRequest;
import com.quanlydaotao.backend.scheduleadjustment.dto.ScheduleAdjustmentValidationResponse;
import com.quanlydaotao.backend.scheduleadjustment.dto.ValidationResultDto;
import com.quanlydaotao.backend.scheduleadjustment.entity.ScheduleAdjustmentRequest;
import com.quanlydaotao.backend.scheduleadjustment.entity.TeachingSessionOverride;
import com.quanlydaotao.backend.scheduleadjustment.mapper.ScheduleAdjustmentMapper;
import com.quanlydaotao.backend.scheduleadjustment.repository.ScheduleAdjustmentRequestRepository;
import com.quanlydaotao.backend.scheduleadjustment.repository.TeachingSessionOverrideRepository;
import com.quanlydaotao.backend.scheduleadjustment.service.ScheduleAdjustmentService;
import com.quanlydaotao.backend.scheduling.entity.Schedule;
import com.quanlydaotao.backend.scheduling.repository.ScheduleRepository;
import com.quanlydaotao.backend.semester.entity.Semester;
import com.quanlydaotao.backend.semester.repository.SemesterRepository;
import com.quanlydaotao.backend.teachingassignment.repository.TeachingAssignmentRepository;
import com.quanlydaotao.backend.user.entity.User;
import com.quanlydaotao.backend.user.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.util.StringUtils;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.Locale;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class ScheduleAdjustmentServiceImpl implements ScheduleAdjustmentService {
    private static final List<String> VALID_TYPES = List.of("ABSENT_MAKEUP", "EXTRA_SESSION", "RESCHEDULE", "ROOM_CHANGE");
    private static final List<String> HARD_ERROR_RULES = List.of("INPUT", "AUTH", "R1", "R2", "R3", "R4", "R5", "R6");

    private final ScheduleAdjustmentRequestRepository requestRepository;
    private final TeachingSessionOverrideRepository overrideRepository;
    private final ScheduleRepository scheduleRepository;
    private final CourseClassRepository courseClassRepository;
    private final SemesterRepository semesterRepository;
    private final TeachingAssignmentRepository teachingAssignmentRepository;
    private final EmployeeLeaveRequestRepository leaveRequestRepository;
    private final RoomRepository roomRepository;
    private final UserRepository userRepository;
    private final EmployeeRepository employeeRepository;
    private final InstructorProfileRepository instructorProfileRepository;
    private final ScheduleAdjustmentMapper mapper;

    @Override
    @Transactional(readOnly = true)
    public ScheduleAdjustmentValidationResponse validate(ScheduleAdjustmentValidateRequest request) {
        return validateInternal(request, null);
    }

    @Override
    @Transactional(readOnly = true)
    public ScheduleAdjustmentValidationResponse validateForCurrentInstructor(String username, ScheduleAdjustmentValidateRequest request) {
        request.setRequestedByInstructorId(resolveCurrentInstructorId(username));
        return validateInternal(request, null);
    }

    @Override
    @Transactional
    public ScheduleAdjustmentResponse submit(ScheduleAdjustmentSubmitRequest request) {
        ScheduleAdjustmentValidationResponse validation = validateInternal(request, null);
        if (!Boolean.TRUE.equals(validation.getValid())) {
            throw new BusinessException(ErrorCode.SCHEDULE_ADJUSTMENT_INVALID,
                    "Yêu cầu điều chỉnh lịch còn lỗi, vui lòng kiểm tra lại");
        }
        Schedule originalSchedule = resolveOriginalSchedule(request);
        ScheduleAdjustmentRequest entity = new ScheduleAdjustmentRequest();
        mapper.updateEntityFromDto(request, entity);
        entity.setOriginalScheduleId(originalSchedule != null ? originalSchedule.getScheduleId() : request.getOriginalScheduleId());
        entity.setRequestType(normalizeType(request.getRequestType()));
        entity.setReason(request.getReason().trim());
        entity.setStatus("PENDING");
        entity.setIsActive(true);
        return mapper.toDto(requestRepository.save(entity));
    }

    @Override
    @Transactional
    public ScheduleAdjustmentResponse submitForCurrentInstructor(String username, ScheduleAdjustmentSubmitRequest request) {
        request.setRequestedByInstructorId(resolveCurrentInstructorId(username));
        return submit(request);
    }

    @Override
    @Transactional(readOnly = true)
    public List<ScheduleAdjustmentResponse> searchAdmin(String status, UUID courseClassId, UUID instructorId) {
        return mapper.toDtoList(requestRepository.search(normalizeBlank(status), courseClassId, instructorId));
    }

    @Override
    @Transactional(readOnly = true)
    public List<ScheduleAdjustmentResponse> getByInstructor(UUID instructorId) {
        return mapper.toDtoList(requestRepository.findByRequestedByInstructorIdAndIsActiveTrue(instructorId));
    }

    @Override
    @Transactional(readOnly = true)
    public List<ScheduleAdjustmentResponse> getCurrentInstructorRequests(String username) {
        return getByInstructor(resolveCurrentInstructorId(username));
    }

    @Override
    @Transactional
    public ScheduleAdjustmentResponse approve(UUID requestId, ScheduleAdjustmentReviewRequest request) {
        ScheduleAdjustmentRequest entity = findForUpdate(requestId);
        ensureReviewable(entity);
        ScheduleAdjustmentValidationResponse validation = validateInternal(toValidateRequest(entity), entity.getRequestId());
        if (hasHardErrors(validation)) {
            entity.setStatus("CONFLICT_DETECTED");
            entity.setAdminNote("Phát hiện xung đột khi duyệt, vui lòng kiểm tra lại");
            requestRepository.save(entity);
            throw new BusinessException(ErrorCode.CONFLICT, "Yêu cầu có xung đột tại thời điểm duyệt");
        }
        createOverrides(entity);
        entity.setStatus("APPROVED");
        entity.setAdminNote(request.getNote());
        entity.setReviewedBy(request.getReviewedBy());
        entity.setReviewedAt(LocalDateTime.now());
        return mapper.toDto(requestRepository.save(entity));
    }

    @Override
    @Transactional
    public ScheduleAdjustmentResponse reject(UUID requestId, ScheduleAdjustmentReviewRequest request) {
        ScheduleAdjustmentRequest entity = findForUpdate(requestId);
        ensureReviewable(entity);
        entity.setStatus("REJECTED");
        entity.setAdminNote(request.getNote());
        entity.setReviewedBy(request.getReviewedBy());
        entity.setReviewedAt(LocalDateTime.now());
        return mapper.toDto(requestRepository.save(entity));
    }

    @Override
    @Transactional
    public ScheduleAdjustmentResponse returnToInstructor(UUID requestId, ScheduleAdjustmentReviewRequest request) {
        ScheduleAdjustmentRequest entity = findForUpdate(requestId);
        ensureReviewable(entity);
        entity.setStatus("RETURNED");
        entity.setAdminNote(request.getNote());
        entity.setReviewedBy(request.getReviewedBy());
        entity.setReviewedAt(LocalDateTime.now());
        return mapper.toDto(requestRepository.save(entity));
    }

    private ScheduleAdjustmentValidationResponse validateInternal(ScheduleAdjustmentValidateRequest request, UUID ignoredRequestId) {
        List<ValidationResultDto> results = new ArrayList<>();
        String requestType = normalizeType(request.getRequestType());
        validateInput(request, requestType, results);
        CourseClass courseClass = courseClassRepository.findById(request.getCourseClassId()).orElse(null);
        if (courseClass == null) {
            add(results, "INPUT", "ERROR", "Lớp học phần không tồn tại");
            return response(results);
        }
        if (!teachingAssignmentRepository.existsByInstructorIdAndCourseClassIdAndSemesterIdAndIsActiveTrue(
                request.getRequestedByInstructorId(), request.getCourseClassId(), courseClass.getSemesterId())) {
            add(results, "AUTH", "ERROR", "Giảng viên chưa được phân công phụ trách lớp học phần này");
        }

        Schedule originalSchedule = resolveOriginalSchedule(request);
        if (requiresOriginalSession(requestType)) {
            if (originalSchedule == null) {
                add(results, "R1", "ERROR", "Ngày nghỉ không có lịch dạy cố định phù hợp");
            } else {
                add(results, "R1", "OK", "Tìm thấy buổi lịch gốc cần điều chỉnh");
                if (requestRepository.hasActiveRequestForOriginalSchedule(originalSchedule.getScheduleId())
                        && ignoredRequestId == null) {
                    add(results, "R2", "ERROR", "Buổi này đã có yêu cầu điều chỉnh đang xử lý");
                } else {
                    add(results, "R2", "OK", "Buổi này chưa có yêu cầu điều chỉnh đang xử lý");
                }
            }
        }

        if (request.getProposedDate() != null && request.getProposedTimeSlotId() != null) {
            if (scheduleRepository.hasInstructorConflict(request.getRequestedByInstructorId(), request.getProposedDate(),
                    request.getProposedTimeSlotId(), request.getCourseClassId())
                    || overrideRepository.hasInstructorConflict(request.getRequestedByInstructorId(), request.getProposedDate(), request.getProposedTimeSlotId())) {
                add(results, "R3", "ERROR", "Giảng viên bị trùng lịch ở ngày/tiết đề xuất");
            } else {
                add(results, "R3", "OK", "Giảng viên rảnh ở ngày/tiết đề xuất");
            }
            if (leaveRequestRepository.hasApprovedLeaveOnDate(request.getRequestedByInstructorId(), request.getProposedDate())) {
                add(results, "R4", "ERROR", "Giảng viên có đơn nghỉ đã duyệt trong ngày đề xuất");
            } else {
                add(results, "R4", "OK", "Giảng viên không có đơn nghỉ đã duyệt trong ngày đề xuất");
            }
            if (request.getProposedRoomId() != null) {
                if (!roomRepository.existsById(request.getProposedRoomId())) {
                    add(results, "R5", "ERROR", "Phòng đề xuất không tồn tại");
                } else {
                    boolean roomBusy = scheduleRepository.hasRoomConflict(request.getProposedRoomId(), request.getProposedDate(), request.getProposedTimeSlotId())
                            || overrideRepository.hasRoomConflict(request.getProposedRoomId(), request.getProposedDate(), request.getProposedTimeSlotId())
                            || requestRepository.hasRoomHold(request.getProposedRoomId(), request.getProposedDate(), request.getProposedTimeSlotId(), ignoredRequestId);
                    add(results, "R5", roomBusy ? "ERROR" : "OK", roomBusy ? "Phòng đề xuất đã bị đặt hoặc đang được giữ bởi yêu cầu khác" : "Phòng đề xuất còn trống");
                }
            }
            validateSemesterRange(courseClass, request.getProposedDate(), results);
            if (scheduleRepository.hasCourseClassConflict(request.getCourseClassId(), request.getProposedDate(), request.getProposedTimeSlotId())) {
                add(results, "R8", "WARN", "Lớp học phần đã có lịch khác ở ngày/tiết đề xuất");
            }
        }
        return response(results);
    }

    private void validateInput(ScheduleAdjustmentValidateRequest request, String requestType, List<ValidationResultDto> results) {
        if (!VALID_TYPES.contains(requestType)) {
            add(results, "INPUT", "ERROR", "Loại yêu cầu không hợp lệ");
        }
        if (request.getRequestedByInstructorId() == null) {
            add(results, "INPUT", "ERROR", "Giảng viên yêu cầu không được để trống");
        }
        if (request.getAbsentPeriods() != null && (request.getAbsentPeriods() < 1 || request.getAbsentPeriods() > 10)) {
            add(results, "INPUT", "ERROR", "Số tiết nghỉ phải từ 1 đến 10");
        }
        if (("ABSENT_MAKEUP".equals(requestType) || "RESCHEDULE".equals(requestType)) && request.getProposedDate() == null) {
            add(results, "INPUT", "ERROR", "Yêu cầu nghỉ/bù hoặc đổi lịch phải có ngày đề xuất");
        }
        if (VALID_TYPES.contains(requestType)
                && (request.getProposedDate() == null || request.getProposedTimeSlotId() == null || request.getProposedPeriods() == null)) {
            add(results, "INPUT", "ERROR", "Ngày, ca/tiết và số tiết đề xuất không được để trống");
        }
        if (requiresOriginalSession(requestType)
                && request.getOriginalScheduleId() == null
                && (request.getAbsentDate() == null || request.getAbsentTimeSlotId() == null || request.getAbsentPeriods() == null)) {
            add(results, "INPUT", "ERROR", "Yêu cầu điều chỉnh lịch gốc phải có buổi gốc hoặc ngày/ca/số tiết nghỉ");
        }
        if ("ROOM_CHANGE".equals(requestType) && request.getProposedRoomId() == null) {
            add(results, "INPUT", "ERROR", "Yêu cầu đổi phòng phải có phòng đề xuất");
        }
        if ("ABSENT_MAKEUP".equals(requestType) && request.getAbsentPeriods() != null && request.getProposedPeriods() != null
                && !request.getAbsentPeriods().equals(request.getProposedPeriods())) {
            add(results, "INPUT", "ERROR", "Số tiết bù phải bằng số tiết nghỉ");
        }
        if (request.getProposedDate() != null && request.getProposedDate().isBefore(LocalDate.now())) {
            add(results, "INPUT", "ERROR", "Ngày đề xuất không được nằm trong quá khứ");
        }
    }

    private void validateSemesterRange(CourseClass courseClass, LocalDate proposedDate, List<ValidationResultDto> results) {
        Semester semester = semesterRepository.findById(courseClass.getSemesterId()).orElse(null);
        if (semester == null) {
            add(results, "R6", "ERROR", "Không tìm thấy học kỳ của lớp học phần");
            return;
        }
        boolean inRange = !proposedDate.isBefore(semester.getStartDate()) && !proposedDate.isAfter(semester.getEndDate());
        add(results, "R6", inRange ? "OK" : "ERROR", inRange ? "Ngày bù nằm trong phạm vi học kỳ" : "Ngày bù nằm ngoài phạm vi học kỳ");
        if (inRange && !proposedDate.isBefore(semester.getEndDate().minusDays(7))) {
            add(results, "R9", "WARN", "Ngày bù gần cuối kỳ, nên thông báo sớm cho sinh viên");
        }
    }

    private void createOverrides(ScheduleAdjustmentRequest request) {
        if (requiresOriginalSession(request.getRequestType()) && request.getOriginalScheduleId() != null) {
            TeachingSessionOverride cancel = new TeachingSessionOverride();
            cancel.setRequestId(request.getRequestId());
            cancel.setCourseClassId(request.getCourseClassId());
            cancel.setOriginalScheduleId(request.getOriginalScheduleId());
            cancel.setOriginalDate(request.getAbsentDate());
            cancel.setOverrideType("CANCELLED");
            cancel.setTeachingDate(request.getAbsentDate());
            cancel.setTimeSlotId(request.getAbsentTimeSlotId());
            cancel.setInstructorId(request.getRequestedByInstructorId());
            cancel.setNumberOfPeriods(request.getAbsentPeriods());
            cancel.setIsVisible(false);
            cancel.setStatus("APPROVED");
            cancel.setNote(request.getReason());
            cancel.setIsActive(true);
            overrideRepository.save(cancel);
        }
        if (request.getProposedDate() != null && request.getProposedTimeSlotId() != null) {
            TeachingSessionOverride makeup = new TeachingSessionOverride();
            makeup.setRequestId(request.getRequestId());
            makeup.setCourseClassId(request.getCourseClassId());
            makeup.setOriginalScheduleId(request.getOriginalScheduleId());
            makeup.setOriginalDate(request.getAbsentDate());
            makeup.setOverrideType(resolveOverrideType(request.getRequestType()));
            makeup.setTeachingDate(request.getProposedDate());
            makeup.setTimeSlotId(request.getProposedTimeSlotId());
            makeup.setRoomId(request.getProposedRoomId());
            makeup.setInstructorId(request.getRequestedByInstructorId());
            makeup.setNumberOfPeriods(request.getProposedPeriods());
            makeup.setIsVisible(true);
            makeup.setStatus("PLANNED");
            makeup.setNote(request.getReason());
            makeup.setIsActive(true);
            overrideRepository.save(makeup);
        }
    }

    private Schedule resolveOriginalSchedule(ScheduleAdjustmentValidateRequest request) {
        if (request.getOriginalScheduleId() != null) {
            return scheduleRepository.findById(request.getOriginalScheduleId()).orElse(null);
        }
        if (request.getAbsentDate() == null || request.getAbsentTimeSlotId() == null || request.getCourseClassId() == null) {
            return null;
        }
        return scheduleRepository.findFixedSession(request.getCourseClassId(), request.getAbsentDate(), request.getAbsentTimeSlotId()).orElse(null);
    }

    private ScheduleAdjustmentValidateRequest toValidateRequest(ScheduleAdjustmentRequest entity) {
        ScheduleAdjustmentValidateRequest request = new ScheduleAdjustmentValidateRequest();
        request.setCourseClassId(entity.getCourseClassId());
        request.setOriginalScheduleId(entity.getOriginalScheduleId());
        request.setRequestedByInstructorId(entity.getRequestedByInstructorId());
        request.setRequestType(entity.getRequestType());
        request.setAbsentDate(entity.getAbsentDate());
        request.setAbsentTimeSlotId(entity.getAbsentTimeSlotId());
        request.setAbsentPeriods(entity.getAbsentPeriods());
        request.setProposedDate(entity.getProposedDate());
        request.setProposedTimeSlotId(entity.getProposedTimeSlotId());
        request.setProposedRoomId(entity.getProposedRoomId());
        request.setProposedPeriods(entity.getProposedPeriods());
        return request;
    }

    private ScheduleAdjustmentRequest findForUpdate(UUID requestId) {
        return requestRepository.findByIdForUpdate(requestId)
                .orElseThrow(() -> new ResourceNotFoundException(ErrorCode.RESOURCE_NOT_FOUND,
                        "Không tìm thấy yêu cầu điều chỉnh lịch"));
    }

    private UUID resolveCurrentInstructorId(String username) {
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new ResourceNotFoundException(ErrorCode.RESOURCE_NOT_FOUND, "Không tìm thấy tài khoản"));
        Employee employee = employeeRepository.findByPersonPersonId(user.getPerson().getPersonId())
                .orElseThrow(() -> new ResourceNotFoundException(ErrorCode.RESOURCE_NOT_FOUND,
                        "Tài khoản hiện tại không có hồ sơ nhân viên"));
        InstructorProfile instructor = instructorProfileRepository.findByEmployeeEmployeeId(employee.getEmployeeId())
                .orElseThrow(() -> new ResourceNotFoundException(ErrorCode.FORBIDDEN,
                        "Tài khoản hiện tại không phải giảng viên"));
        return instructor.getEmployee().getEmployeeId();
    }

    private void ensureReviewable(ScheduleAdjustmentRequest entity) {
        if (!List.of("PENDING", "CONFLICT_DETECTED").contains(entity.getStatus())) {
            throw new BusinessException(ErrorCode.SCHEDULE_ADJUSTMENT_NOT_REVIEWABLE,
                    "Không thể xử lý yêu cầu ở trạng thái hiện tại");
        }
    }

    private ScheduleAdjustmentValidationResponse response(List<ValidationResultDto> results) {
        boolean valid = results.stream().noneMatch(result -> "ERROR".equals(result.getStatus()));
        return ScheduleAdjustmentValidationResponse.builder().valid(valid).results(results).build();
    }

    private boolean hasHardErrors(ScheduleAdjustmentValidationResponse response) {
        return response.getResults().stream()
                .anyMatch(result -> "ERROR".equals(result.getStatus()) && HARD_ERROR_RULES.contains(result.getRule()));
    }

    private void add(List<ValidationResultDto> results, String rule, String status, String message) {
        results.add(ValidationResultDto.builder().rule(rule).status(status).message(message).build());
    }

    private boolean requiresOriginalSession(String requestType) {
        return List.of("ABSENT_MAKEUP", "RESCHEDULE", "ROOM_CHANGE").contains(requestType);
    }

    private String resolveOverrideType(String requestType) {
        return switch (requestType) {
            case "EXTRA_SESSION" -> "EXTRA";
            case "ROOM_CHANGE" -> "ROOM_CHANGE";
            default -> "MAKEUP";
        };
    }

    private String normalizeType(String value) {
        return StringUtils.hasText(value) ? value.trim().toUpperCase(Locale.ROOT) : "";
    }

    private String normalizeBlank(String value) {
        return StringUtils.hasText(value) ? value.trim().toUpperCase(Locale.ROOT) : null;
    }
}

package com.quanlydaotao.backend.scheduleadjustment.service.impl;

import com.quanlydaotao.backend.common.exception.BusinessException;
import com.quanlydaotao.backend.common.exception.ErrorCode;
import com.quanlydaotao.backend.common.exception.ResourceNotFoundException;
import com.quanlydaotao.backend.course.entity.CourseClass;
import com.quanlydaotao.backend.course.repository.CourseClassRepository;
import com.quanlydaotao.backend.employee.entity.Employee;
import com.quanlydaotao.backend.employee.repository.EmployeeRepository;
import com.quanlydaotao.backend.employeeleave.repository.EmployeeLeaveRequestRepository;
import com.quanlydaotao.backend.facility.entity.Room;
import com.quanlydaotao.backend.facility.repository.RoomRepository;
import com.quanlydaotao.backend.instructor.entity.InstructorProfile;
import com.quanlydaotao.backend.instructor.repository.InstructorProfileRepository;
import com.quanlydaotao.backend.scheduleadjustment.dto.ProposedRoomStatusDto;
import com.quanlydaotao.backend.scheduleadjustment.dto.ProposedSlotStatusDto;
import com.quanlydaotao.backend.scheduleadjustment.dto.ScheduleAdjustmentBatchApproveRequest;
import com.quanlydaotao.backend.scheduleadjustment.dto.ScheduleAdjustmentBatchApproveResponse;
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
import com.quanlydaotao.backend.scheduling.entity.TimeSlot;
import com.quanlydaotao.backend.scheduling.repository.ScheduleRepository;
import com.quanlydaotao.backend.scheduling.repository.TimeSlotRepository;
import com.quanlydaotao.backend.semester.entity.Semester;
import com.quanlydaotao.backend.semester.repository.SemesterRepository;
import com.quanlydaotao.backend.teachingassignment.repository.TeachingAssignmentRepository;
import com.quanlydaotao.backend.user.entity.User;
import com.quanlydaotao.backend.user.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.PlatformTransactionManager;
import org.springframework.transaction.TransactionDefinition;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.transaction.support.TransactionTemplate;
import org.springframework.util.StringUtils;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;
import java.util.ArrayList;
import java.util.List;
import java.util.Locale;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class ScheduleAdjustmentServiceImpl implements ScheduleAdjustmentService {
    private static final List<String> VALID_TYPES = List.of("ABSENT_MAKEUP", "EXTRA_SESSION", "RESCHEDULE", "ROOM_CHANGE");

    private final ScheduleAdjustmentRequestRepository requestRepository;
    private final TeachingSessionOverrideRepository overrideRepository;
    private final ScheduleRepository scheduleRepository;
    private final CourseClassRepository courseClassRepository;
    private final SemesterRepository semesterRepository;
    private final TeachingAssignmentRepository teachingAssignmentRepository;
    private final EmployeeLeaveRequestRepository leaveRequestRepository;
    private final RoomRepository roomRepository;
    private final TimeSlotRepository timeSlotRepository;
    private final UserRepository userRepository;
    private final EmployeeRepository employeeRepository;
    private final InstructorProfileRepository instructorProfileRepository;
    private final ScheduleAdjustmentMapper mapper;
    private final PlatformTransactionManager transactionManager;

    @Override
    @Transactional(readOnly = true)
    public ScheduleAdjustmentValidationResponse validate(ScheduleAdjustmentValidateRequest request) {
        return buildValidationPreview(request, null);
    }

    @Override
    @Transactional(readOnly = true)
    public ScheduleAdjustmentValidationResponse validateForCurrentInstructor(String username, ScheduleAdjustmentValidateRequest request) {
        request.setRequestedByInstructorId(resolveCurrentInstructorId(username));
        return buildValidationPreview(request, null);
    }

    @Override
    @Transactional
    public ScheduleAdjustmentResponse submit(ScheduleAdjustmentSubmitRequest request) {
        WorkflowContext context = validateWorkflowOrThrow(request, null);
        ScheduleAdjustmentRequest entity = new ScheduleAdjustmentRequest();
        mapper.updateEntityFromDto(request, entity);
        entity.setOriginalScheduleId(context.originalSchedule() != null
                ? context.originalSchedule().getScheduleId()
                : request.getOriginalScheduleId());
        entity.setRequestType(context.requestType());
        entity.setReason(request.getReason().trim());
        entity.setStatus("PENDING");
        entity.setIsActive(true);
        return enrichResponse(mapper.toDto(requestRepository.save(entity)));
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
        return enrichResponses(mapper.toDtoList(requestRepository.search(normalizeBlank(status), courseClassId, instructorId)));
    }

    @Override
    @Transactional(readOnly = true)
    public List<ScheduleAdjustmentResponse> getByInstructor(UUID instructorId) {
        return enrichResponses(mapper.toDtoList(requestRepository.findByRequestedByInstructorIdAndIsActiveTrue(instructorId)));
    }

    @Override
    @Transactional(readOnly = true)
    public List<ScheduleAdjustmentResponse> getCurrentInstructorRequests(String username) {
        return getCurrentInstructorRequests(username, null, null);
    }

    @Override
    @Transactional(readOnly = true)
    public List<ScheduleAdjustmentResponse> getCurrentInstructorRequests(String username, String status, UUID courseClassId) {
        UUID instructorId = resolveCurrentInstructorId(username);
        return enrichResponses(mapper.toDtoList(requestRepository.searchMine(instructorId, normalizeBlank(status), courseClassId)));
    }

    @Override
    @Transactional(readOnly = true)
    public ScheduleAdjustmentResponse getCurrentInstructorRequest(String username, UUID requestId) {
        return enrichResponse(mapper.toDto(findOwnedRequest(username, requestId)));
    }

    @Override
    @Transactional
    public ScheduleAdjustmentResponse updateCurrentInstructorRequest(String username, UUID requestId, ScheduleAdjustmentSubmitRequest request) {
        UUID instructorId = resolveCurrentInstructorId(username);
        ScheduleAdjustmentRequest entity = findOwnedRequest(instructorId, requestId);
        ensureEditableByInstructor(entity);
        request.setRequestedByInstructorId(instructorId);
        WorkflowContext context = validateWorkflowOrThrow(request, requestId);
        mapper.updateEntityFromDto(request, entity);
        entity.setOriginalScheduleId(context.originalSchedule() != null
                ? context.originalSchedule().getScheduleId()
                : request.getOriginalScheduleId());
        entity.setRequestType(context.requestType());
        entity.setReason(request.getReason().trim());
        entity.setStatus("PENDING");
        entity.setAdminNote(null);
        entity.setReviewedAt(null);
        entity.setReviewedBy(null);
        return enrichResponse(mapper.toDto(requestRepository.save(entity)));
    }

    @Override
    @Transactional
    public void cancelCurrentInstructorRequest(String username, UUID requestId) {
        ScheduleAdjustmentRequest entity = findOwnedRequest(username, requestId);
        if (!"PENDING".equals(entity.getStatus())) {
            throw new BusinessException(ErrorCode.SCHEDULE_ADJUSTMENT_NOT_REVIEWABLE,
                    "Chỉ có thể hủy yêu cầu đang chờ duyệt");
        }
        entity.setStatus("CANCELLED");
        entity.setIsActive(false);
        entity.setDeletedAt(LocalDateTime.now());
        requestRepository.save(entity);
    }

    @Override
    @Transactional
    public ScheduleAdjustmentResponse approve(UUID requestId, ScheduleAdjustmentReviewRequest request) {
        ScheduleAdjustmentRequest entity = findForUpdate(requestId);
        ensureReviewable(entity);
        try {
            validateWorkflowOrThrow(toSubmitRequest(entity), entity.getRequestId());
        } catch (BusinessException ex) {
            entity.setStatus("CONFLICT_DETECTED");
            entity.setAdminNote("Phát hiện xung đột khi duyệt: " + ex.getMessage());
            requestRepository.save(entity);
            throw ex;
        }
        createOverrides(entity);
        entity.setStatus("APPROVED");
        entity.setAdminNote(request.getNote());
        entity.setReviewedBy(request.getReviewedBy());
        entity.setReviewedAt(LocalDateTime.now());
        return enrichResponse(mapper.toDto(requestRepository.save(entity)));
    }

    @Override
    @Transactional
    public ScheduleAdjustmentResponse reject(UUID requestId, ScheduleAdjustmentReviewRequest request) {
        ScheduleAdjustmentRequest entity = findForUpdate(requestId);
        ensureReviewable(entity);
        requireAdminNote(request.getNote(), "Lý do từ chối phải có ít nhất 10 ký tự");
        entity.setStatus("REJECTED");
        entity.setAdminNote(request.getNote().trim());
        entity.setReviewedBy(request.getReviewedBy());
        entity.setReviewedAt(LocalDateTime.now());
        return enrichResponse(mapper.toDto(requestRepository.save(entity)));
    }

    @Override
    @Transactional
    public ScheduleAdjustmentResponse returnToInstructor(UUID requestId, ScheduleAdjustmentReviewRequest request) {
        ScheduleAdjustmentRequest entity = findForUpdate(requestId);
        ensureReviewable(entity);
        requireAdminNote(request.getNote(), "Ghi chú trả về phải có ít nhất 10 ký tự");
        entity.setStatus("RETURNED");
        entity.setAdminNote(request.getNote().trim());
        entity.setReviewedBy(request.getReviewedBy());
        entity.setReviewedAt(LocalDateTime.now());
        return enrichResponse(mapper.toDto(requestRepository.save(entity)));
    }

    @Override
    public ScheduleAdjustmentBatchApproveResponse batchApprove(ScheduleAdjustmentBatchApproveRequest request) {
        List<UUID> successIds = new ArrayList<>();
        List<UUID> failedIds = new ArrayList<>();
        List<String> errors = new ArrayList<>();
        for (UUID requestId : request.getRequestIds()) {
            try {
                TransactionTemplate transactionTemplate = new TransactionTemplate(transactionManager);
                transactionTemplate.setPropagationBehavior(TransactionDefinition.PROPAGATION_REQUIRES_NEW);
                transactionTemplate.executeWithoutResult(status -> approveSingleRequest(requestId, request));
                successIds.add(requestId);
            } catch (RuntimeException ex) {
                failedIds.add(requestId);
                errors.add(requestId + ": " + ex.getMessage());
            }
        }
        return ScheduleAdjustmentBatchApproveResponse.builder()
                .successIds(successIds)
                .failedIds(failedIds)
                .errors(errors)
                .build();
    }

    private void approveSingleRequest(UUID requestId, ScheduleAdjustmentBatchApproveRequest request) {
        ScheduleAdjustmentReviewRequest review = new ScheduleAdjustmentReviewRequest();
        review.setReviewedBy(request.getReviewedBy());
        review.setNote(request.getNote());
        approve(requestId, review);
    }

    private ScheduleAdjustmentValidationResponse buildValidationPreview(ScheduleAdjustmentValidateRequest request, UUID ignoredRequestId) {
        List<ValidationResultDto> results = new ArrayList<>();
        String requestType = normalizeType(request.getRequestType());
        validateInput(request, requestType, results);

        CourseClass courseClass = courseClassRepository.findById(request.getCourseClassId()).orElse(null);
        if (courseClass == null) {
            add(results, "INPUT", "ERROR", "Lớp học phần không tồn tại");
            return response(results, request, ignoredRequestId);
        }
        addInstructorAssignmentResult(request, courseClass, results);
        addOriginalSessionResults(request, requestType, ignoredRequestId, results);
        addProposedSessionResults(request, courseClass, ignoredRequestId, results);
        return response(results, request, ignoredRequestId);
    }

    private WorkflowContext validateWorkflowOrThrow(ScheduleAdjustmentSubmitRequest request, UUID ignoredRequestId) {
        String requestType = requireValidInput(request);
        CourseClass courseClass = requireCourseClass(request.getCourseClassId());
        requireInstructorAssigned(request, courseClass);
        Schedule originalSchedule = requireOriginalScheduleIfNeeded(request, requestType);
        ensureOriginalScheduleNotHeld(originalSchedule, requestType, ignoredRequestId);
        ensureProposedSessionAvailable(request, courseClass, ignoredRequestId);
        return new WorkflowContext(requestType, courseClass, originalSchedule);
    }

    private String requireValidInput(ScheduleAdjustmentSubmitRequest request) {
        String requestType = normalizeType(request.getRequestType());
        if (!VALID_TYPES.contains(requestType)) {
            throw new BusinessException(ErrorCode.SCHEDULE_ADJUSTMENT_INVALID, "Loại yêu cầu không hợp lệ");
        }
        if (request.getRequestedByInstructorId() == null) {
            throw new BusinessException(ErrorCode.SCHEDULE_ADJUSTMENT_INVALID, "Giảng viên yêu cầu không được để trống");
        }
        if (!StringUtils.hasText(request.getReason())) {
            throw new BusinessException(ErrorCode.SCHEDULE_ADJUSTMENT_INVALID, "Lý do điều chỉnh không được để trống");
        }
        if (request.getAbsentPeriods() != null && (request.getAbsentPeriods() < 1 || request.getAbsentPeriods() > 10)) {
            throw new BusinessException(ErrorCode.SCHEDULE_ADJUSTMENT_INVALID, "Số tiết nghỉ phải từ 1 đến 10");
        }
        if (requiresOriginalSession(requestType)
                && request.getOriginalScheduleId() == null
                && (request.getAbsentDate() == null || request.getAbsentTimeSlotId() == null || request.getAbsentPeriods() == null)) {
            throw new BusinessException(ErrorCode.SCHEDULE_ADJUSTMENT_INVALID,
                    "Yêu cầu điều chỉnh lịch gốc phải có buổi gốc hoặc ngày/ca/số tiết nghỉ");
        }
        if (request.getProposedDate() == null || request.getProposedTimeSlotId() == null || request.getProposedPeriods() == null) {
            throw new BusinessException(ErrorCode.SCHEDULE_ADJUSTMENT_INVALID,
                    "Ngày, ca/tiết và số tiết đề xuất không được để trống");
        }
        if ("ROOM_CHANGE".equals(requestType) && request.getProposedRoomId() == null) {
            throw new BusinessException(ErrorCode.SCHEDULE_ADJUSTMENT_INVALID, "Yêu cầu đổi phòng phải có phòng đề xuất");
        }
        if ("ABSENT_MAKEUP".equals(requestType) && request.getAbsentPeriods() != null
                && !request.getAbsentPeriods().equals(request.getProposedPeriods())) {
            throw new BusinessException(ErrorCode.SCHEDULE_ADJUSTMENT_INVALID,
                    "Số tiết bù phải bằng số tiết nghỉ");
        }
        if (request.getProposedDate().isBefore(LocalDate.now())) {
            throw new BusinessException(ErrorCode.SCHEDULE_ADJUSTMENT_INVALID,
                    "Ngày đề xuất không được nằm trong quá khứ");
        }
        return requestType;
    }

    private CourseClass requireCourseClass(UUID courseClassId) {
        return courseClassRepository.findById(courseClassId)
                .orElseThrow(() -> new ResourceNotFoundException(ErrorCode.RESOURCE_NOT_FOUND,
                        "Lớp học phần không tồn tại"));
    }

    private void requireInstructorAssigned(ScheduleAdjustmentValidateRequest request, CourseClass courseClass) {
        if (!teachingAssignmentRepository.existsByInstructorIdAndCourseClassIdAndSemesterIdAndIsActiveTrue(
                request.getRequestedByInstructorId(), request.getCourseClassId(), courseClass.getSemesterId())) {
            throw new BusinessException(ErrorCode.SCHEDULE_INSTRUCTOR_NOT_ASSIGNED,
                    "Giảng viên chưa được phân công phụ trách lớp học phần này");
        }
    }

    private Schedule requireOriginalScheduleIfNeeded(ScheduleAdjustmentValidateRequest request, String requestType) {
        Schedule originalSchedule = resolveOriginalSchedule(request);
        if (requiresOriginalSession(requestType) && originalSchedule == null) {
            throw new ResourceNotFoundException(ErrorCode.SCHEDULE_ORIGINAL_NOT_FOUND,
                    "Ngày nghỉ không có lịch dạy cố định phù hợp");
        }
        return originalSchedule;
    }

    private void ensureOriginalScheduleNotHeld(Schedule originalSchedule, String requestType, UUID ignoredRequestId) {
        if (requiresOriginalSession(requestType)
                && originalSchedule != null
                && requestRepository.hasActiveRequestForOriginalSchedule(originalSchedule.getScheduleId(), ignoredRequestId)) {
            throw new BusinessException(ErrorCode.SCHEDULE_ALREADY_HAS_PENDING_REQUEST,
                    "Buổi này đã có yêu cầu điều chỉnh đang xử lý");
        }
    }

    private void ensureProposedSessionAvailable(ScheduleAdjustmentValidateRequest request, CourseClass courseClass, UUID ignoredRequestId) {
        ensureSemesterRange(courseClass, request.getProposedDate());
        if (scheduleRepository.hasInstructorConflict(request.getRequestedByInstructorId(), request.getProposedDate(),
                request.getProposedTimeSlotId(), request.getCourseClassId())
                || overrideRepository.hasInstructorConflict(request.getRequestedByInstructorId(), request.getProposedDate(), request.getProposedTimeSlotId())) {
            throw new BusinessException(ErrorCode.SCHEDULE_INSTRUCTOR_CONFLICT,
                    "Giảng viên bị trùng lịch ở ngày/tiết đề xuất");
        }
        if (leaveRequestRepository.hasApprovedLeaveOnDate(request.getRequestedByInstructorId(), request.getProposedDate())) {
            throw new BusinessException(ErrorCode.SCHEDULE_INSTRUCTOR_ON_LEAVE,
                    "Giảng viên có đơn nghỉ đã duyệt trong ngày đề xuất");
        }
        if (request.getProposedRoomId() != null) {
            ensureRoomAvailable(request, ignoredRequestId);
        }
    }

    private void ensureSemesterRange(CourseClass courseClass, LocalDate proposedDate) {
        Semester semester = semesterRepository.findById(courseClass.getSemesterId())
                .orElseThrow(() -> new ResourceNotFoundException(ErrorCode.RESOURCE_NOT_FOUND,
                        "Không tìm thấy học kỳ của lớp học phần"));
        if (proposedDate.isBefore(semester.getStartDate()) || proposedDate.isAfter(semester.getEndDate())) {
            throw new BusinessException(ErrorCode.SCHEDULE_OUT_OF_SEMESTER,
                    "Ngày bù nằm ngoài phạm vi học kỳ");
        }
    }

    private void ensureRoomAvailable(ScheduleAdjustmentValidateRequest request, UUID ignoredRequestId) {
        if (!roomRepository.existsById(request.getProposedRoomId())) {
            throw new ResourceNotFoundException(ErrorCode.RESOURCE_NOT_FOUND, "Phòng đề xuất không tồn tại");
        }
        boolean roomBusy = scheduleRepository.hasRoomConflict(request.getProposedRoomId(), request.getProposedDate(), request.getProposedTimeSlotId())
                || overrideRepository.hasRoomConflict(request.getProposedRoomId(), request.getProposedDate(), request.getProposedTimeSlotId())
                || requestRepository.hasRoomHold(request.getProposedRoomId(), request.getProposedDate(), request.getProposedTimeSlotId(), ignoredRequestId);
        if (roomBusy) {
            throw new BusinessException(ErrorCode.SCHEDULE_ROOM_CONFLICT,
                    "Phòng đề xuất đã bị đặt hoặc đang được giữ bởi yêu cầu khác");
        }
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
        if (requiresOriginalSession(requestType)
                && request.getOriginalScheduleId() == null
                && (request.getAbsentDate() == null || request.getAbsentTimeSlotId() == null || request.getAbsentPeriods() == null)) {
            add(results, "INPUT", "ERROR", "Yêu cầu điều chỉnh lịch gốc phải có buổi gốc hoặc ngày/ca/số tiết nghỉ");
        }
        if (VALID_TYPES.contains(requestType)
                && (request.getProposedDate() == null || request.getProposedTimeSlotId() == null || request.getProposedPeriods() == null)) {
            add(results, "INPUT", "ERROR", "Ngày, ca/tiết và số tiết đề xuất không được để trống");
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

    private void addInstructorAssignmentResult(ScheduleAdjustmentValidateRequest request, CourseClass courseClass, List<ValidationResultDto> results) {
        if (!teachingAssignmentRepository.existsByInstructorIdAndCourseClassIdAndSemesterIdAndIsActiveTrue(
                request.getRequestedByInstructorId(), request.getCourseClassId(), courseClass.getSemesterId())) {
            add(results, "AUTH", "ERROR", "Giảng viên chưa được phân công phụ trách lớp học phần này");
        } else {
            add(results, "AUTH", "OK", "Giảng viên được phân công phụ trách lớp học phần này");
        }
    }

    private void addOriginalSessionResults(ScheduleAdjustmentValidateRequest request, String requestType, UUID ignoredRequestId, List<ValidationResultDto> results) {
        if (!requiresOriginalSession(requestType)) {
            return;
        }
        Schedule originalSchedule = resolveOriginalSchedule(request);
        if (originalSchedule == null) {
            add(results, "R1", "ERROR", "Ngày nghỉ không có lịch dạy cố định phù hợp");
            return;
        }
        add(results, "R1", "OK", "Tìm thấy buổi lịch gốc cần điều chỉnh");
        if (requestRepository.hasActiveRequestForOriginalSchedule(originalSchedule.getScheduleId(), ignoredRequestId)) {
            add(results, "R2", "ERROR", "Buổi này đã có yêu cầu điều chỉnh đang xử lý");
        } else {
            add(results, "R2", "OK", "Buổi này chưa có yêu cầu điều chỉnh đang xử lý");
        }
    }

    private void addProposedSessionResults(ScheduleAdjustmentValidateRequest request, CourseClass courseClass, UUID ignoredRequestId, List<ValidationResultDto> results) {
        if (request.getProposedDate() == null || request.getProposedTimeSlotId() == null) {
            return;
        }
        boolean instructorBusy = scheduleRepository.hasInstructorConflict(request.getRequestedByInstructorId(), request.getProposedDate(),
                request.getProposedTimeSlotId(), request.getCourseClassId())
                || overrideRepository.hasInstructorConflict(request.getRequestedByInstructorId(), request.getProposedDate(), request.getProposedTimeSlotId());
        add(results, "R3", instructorBusy ? "ERROR" : "OK",
                instructorBusy ? "Giảng viên bị trùng lịch ở ngày/tiết đề xuất" : "Giảng viên rảnh ở ngày/tiết đề xuất");

        boolean onLeave = leaveRequestRepository.hasApprovedLeaveOnDate(request.getRequestedByInstructorId(), request.getProposedDate());
        add(results, "R4", onLeave ? "ERROR" : "OK",
                onLeave ? "Giảng viên có đơn nghỉ đã duyệt trong ngày đề xuất" : "Giảng viên không có đơn nghỉ đã duyệt trong ngày đề xuất");

        if (request.getProposedRoomId() != null) {
            if (!roomRepository.existsById(request.getProposedRoomId())) {
                add(results, "R5", "ERROR", "Phòng đề xuất không tồn tại");
            } else {
                boolean roomBusy = isRoomBusy(request.getProposedRoomId(), request.getProposedDate(), request.getProposedTimeSlotId(), ignoredRequestId);
                add(results, "R5", roomBusy ? "ERROR" : "OK",
                        roomBusy ? "Phòng đề xuất đã bị đặt hoặc đang được giữ bởi yêu cầu khác" : "Phòng đề xuất còn trống");
            }
        }
        addSemesterRangeResult(courseClass, request.getProposedDate(), results);
        if (scheduleRepository.hasCourseClassConflict(request.getCourseClassId(), request.getProposedDate(), request.getProposedTimeSlotId())) {
            add(results, "R8", "WARN", "Lớp học phần đã có lịch khác ở ngày/tiết đề xuất");
        }
    }

    private void addSemesterRangeResult(CourseClass courseClass, LocalDate proposedDate, List<ValidationResultDto> results) {
        Semester semester = semesterRepository.findById(courseClass.getSemesterId()).orElse(null);
        if (semester == null) {
            add(results, "R6", "ERROR", "Không tìm thấy học kỳ của lớp học phần");
            return;
        }
        boolean inRange = !proposedDate.isBefore(semester.getStartDate()) && !proposedDate.isAfter(semester.getEndDate());
        add(results, "R6", inRange ? "OK" : "ERROR",
                inRange ? "Ngày bù nằm trong phạm vi học kỳ" : "Ngày bù nằm ngoài phạm vi học kỳ");
        if (inRange && !proposedDate.isBefore(semester.getEndDate().minusDays(7))) {
            add(results, "R9", "WARN", "Ngày bù gần cuối kỳ, nên thông báo sớm cho sinh viên");
        }
    }

    private List<ProposedSlotStatusDto> buildProposedSlots(ScheduleAdjustmentValidateRequest request) {
        if (request.getProposedDate() == null || request.getRequestedByInstructorId() == null || request.getCourseClassId() == null) {
            return List.of();
        }
        boolean onLeave = leaveRequestRepository.hasApprovedLeaveOnDate(request.getRequestedByInstructorId(), request.getProposedDate());
        return timeSlotRepository.findAll().stream()
                .filter(slot -> Boolean.TRUE.equals(slot.getIsActive()))
                .map(slot -> toProposedSlot(request, slot, onLeave))
                .toList();
    }

    private ProposedSlotStatusDto toProposedSlot(ScheduleAdjustmentValidateRequest request, TimeSlot slot, boolean onLeave) {
        boolean instructorBusy = scheduleRepository.hasInstructorConflict(request.getRequestedByInstructorId(), request.getProposedDate(),
                slot.getTimeSlotId(), request.getCourseClassId())
                || overrideRepository.hasInstructorConflict(request.getRequestedByInstructorId(), request.getProposedDate(), slot.getTimeSlotId());
        boolean classBusy = scheduleRepository.hasCourseClassConflict(request.getCourseClassId(), request.getProposedDate(), slot.getTimeSlotId());
        String status = "AVAILABLE";
        String reason = null;
        if (onLeave) {
            status = "LEAVE_CONFLICT";
            reason = "Giảng viên có đơn nghỉ đã duyệt trong ngày này";
        } else if (instructorBusy) {
            status = "GV_CONFLICT";
            reason = "Giảng viên đã có lịch ở khung tiết này";
        } else if (classBusy) {
            status = "STUDENT_CONFLICT";
            reason = "Lớp học phần đã có lịch ở khung tiết này";
        }
        return ProposedSlotStatusDto.builder()
                .timeSlotId(slot.getTimeSlotId())
                .slotCode(slot.getSlotCode())
                .label(buildTimeSlotLabel(slot))
                .startTime(slot.getStartTime())
                .endTime(slot.getEndTime())
                .status(status)
                .conflictReason(reason)
                .build();
    }

    private List<ProposedRoomStatusDto> buildProposedRooms(ScheduleAdjustmentValidateRequest request, UUID ignoredRequestId) {
        if (request.getProposedDate() == null || request.getProposedTimeSlotId() == null) {
            return List.of();
        }
        CourseClass courseClass = courseClassRepository.findById(request.getCourseClassId()).orElse(null);
        Integer minCapacity = courseClass != null ? courseClass.getMaxStudent() : null;
        return roomRepository.findAll().stream()
                .filter(room -> Boolean.TRUE.equals(room.getIsActive()))
                .map(room -> toProposedRoom(request, room, minCapacity, ignoredRequestId))
                .toList();
    }

    private ProposedRoomStatusDto toProposedRoom(ScheduleAdjustmentValidateRequest request, Room room, Integer minCapacity, UUID ignoredRequestId) {
        boolean capacityInvalid = minCapacity != null && room.getCapacity() != null && room.getCapacity() < minCapacity;
        boolean roomBusy = isRoomBusy(room.getRoomId(), request.getProposedDate(), request.getProposedTimeSlotId(), ignoredRequestId);
        String status = "AVAILABLE";
        String reason = null;
        if (roomBusy) {
            status = "ROOM_CONFLICT";
            reason = "Phòng đã có lịch hoặc đang được giữ bởi yêu cầu khác";
        } else if (capacityInvalid) {
            status = "INSUFFICIENT_CAPACITY";
            reason = "Sức chứa phòng nhỏ hơn sĩ số tối đa của lớp học phần";
        }
        return ProposedRoomStatusDto.builder()
                .roomId(room.getRoomId())
                .roomCode(room.getCode())
                .roomName(room.getName())
                .buildingId(room.getBuilding() != null ? room.getBuilding().getBuildingId() : null)
                .buildingName(room.getBuilding() != null ? room.getBuilding().getName() : null)
                .floorNumber(room.getFloorNumber())
                .capacity(room.getCapacity())
                .status(status)
                .conflictReason(reason)
                .build();
    }

    private boolean isRoomBusy(UUID roomId, LocalDate date, UUID timeSlotId, UUID ignoredRequestId) {
        return scheduleRepository.hasRoomConflict(roomId, date, timeSlotId)
                || overrideRepository.hasRoomConflict(roomId, date, timeSlotId)
                || requestRepository.hasRoomHold(roomId, date, timeSlotId, ignoredRequestId);
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

    private ScheduleAdjustmentSubmitRequest toSubmitRequest(ScheduleAdjustmentRequest entity) {
        ScheduleAdjustmentSubmitRequest request = new ScheduleAdjustmentSubmitRequest();
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
        request.setReason(entity.getReason());
        return request;
    }

    private ScheduleAdjustmentRequest findForUpdate(UUID requestId) {
        return requestRepository.findByIdForUpdate(requestId)
                .orElseThrow(() -> new ResourceNotFoundException(ErrorCode.RESOURCE_NOT_FOUND,
                        "Không tìm thấy yêu cầu điều chỉnh lịch"));
    }

    private ScheduleAdjustmentRequest findOwnedRequest(String username, UUID requestId) {
        return findOwnedRequest(resolveCurrentInstructorId(username), requestId);
    }

    private ScheduleAdjustmentRequest findOwnedRequest(UUID instructorId, UUID requestId) {
        return requestRepository.findByRequestIdAndRequestedByInstructorIdAndIsActiveTrue(requestId, instructorId)
                .orElseThrow(() -> new ResourceNotFoundException(ErrorCode.FORBIDDEN,
                        "Không tìm thấy yêu cầu điều chỉnh lịch thuộc giảng viên hiện tại"));
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

    private void ensureEditableByInstructor(ScheduleAdjustmentRequest entity) {
        if (!List.of("PENDING", "RETURNED").contains(entity.getStatus())) {
            throw new BusinessException(ErrorCode.SCHEDULE_ADJUSTMENT_NOT_REVIEWABLE,
                    "Chỉ có thể chỉnh sửa yêu cầu đang chờ duyệt hoặc được trả về");
        }
    }

    private void requireAdminNote(String note, String message) {
        if (!StringUtils.hasText(note) || note.trim().length() < 10) {
            throw new BusinessException(ErrorCode.VALIDATION_ERROR, message);
        }
    }

    private ScheduleAdjustmentValidationResponse response(List<ValidationResultDto> results, ScheduleAdjustmentValidateRequest request, UUID ignoredRequestId) {
        boolean valid = results.stream().noneMatch(result -> "ERROR".equals(result.getStatus()));
        return ScheduleAdjustmentValidationResponse.builder()
                .valid(valid)
                .results(results)
                .proposedSlots(buildProposedSlots(request))
                .proposedRooms(buildProposedRooms(request, ignoredRequestId))
                .build();
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

    private String buildTimeSlotLabel(TimeSlot slot) {
        return slot.getSlotCode() + " (" + formatTime(slot.getStartTime()) + "-" + formatTime(slot.getEndTime()) + ")";
    }

    private String formatTime(LocalTime time) {
        return time != null ? time.toString() : "";
    }

    private String normalizeType(String value) {
        return StringUtils.hasText(value) ? value.trim().toUpperCase(Locale.ROOT) : "";
    }

    private String normalizeBlank(String value) {
        return StringUtils.hasText(value) ? value.trim().toUpperCase(Locale.ROOT) : null;
    }

    private ScheduleAdjustmentResponse enrichResponse(ScheduleAdjustmentResponse dto) {
        if (dto == null) return null;
        if (dto.getCourseClassId() != null) {
            courseClassRepository.findById(dto.getCourseClassId()).ifPresent(cc -> {
                dto.setClassCode(cc.getClassCode());
                if (cc.getCourse() != null) {
                    dto.setCourseClassName(cc.getCourse().getName());
                }
            });
        }
        if (dto.getRequestedByInstructorId() != null) {
            employeeRepository.findById(dto.getRequestedByInstructorId()).ifPresent(emp -> {
                dto.setInstructorCode(emp.getEmployeeCode());
                if (emp.getPerson() != null) {
                    dto.setInstructorName(emp.getPerson().getFullName());
                }
            });
        }
        if (dto.getProposedRoomId() != null) {
            roomRepository.findById(dto.getProposedRoomId()).ifPresent(r -> {
                dto.setProposedRoomCode(r.getCode());
            });
        }
        if (dto.getAbsentTimeSlotId() != null) {
            timeSlotRepository.findById(dto.getAbsentTimeSlotId()).ifPresent(ts -> {
                dto.setAbsentSlotCode(ts.getSlotCode());
            });
        }
        if (dto.getProposedTimeSlotId() != null) {
            timeSlotRepository.findById(dto.getProposedTimeSlotId()).ifPresent(ts -> {
                dto.setProposedSlotCode(ts.getSlotCode());
            });
        }
        return dto;
    }

    private List<ScheduleAdjustmentResponse> enrichResponses(List<ScheduleAdjustmentResponse> list) {
        if (list == null) return List.of();
        list.forEach(this::enrichResponse);
        return list;
    }

    private record WorkflowContext(String requestType, CourseClass courseClass, Schedule originalSchedule) {
    }
}

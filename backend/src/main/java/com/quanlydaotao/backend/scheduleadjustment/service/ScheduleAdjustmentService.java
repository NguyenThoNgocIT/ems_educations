package com.quanlydaotao.backend.scheduleadjustment.service;

import com.quanlydaotao.backend.scheduleadjustment.dto.ScheduleAdjustmentResponse;
import com.quanlydaotao.backend.scheduleadjustment.dto.ScheduleAdjustmentReviewRequest;
import com.quanlydaotao.backend.scheduleadjustment.dto.ScheduleAdjustmentSubmitRequest;
import com.quanlydaotao.backend.scheduleadjustment.dto.ScheduleAdjustmentValidateRequest;
import com.quanlydaotao.backend.scheduleadjustment.dto.ScheduleAdjustmentValidationResponse;

import java.util.List;
import java.util.UUID;

public interface ScheduleAdjustmentService {
    ScheduleAdjustmentValidationResponse validate(ScheduleAdjustmentValidateRequest request);

    ScheduleAdjustmentValidationResponse validateForCurrentInstructor(String username, ScheduleAdjustmentValidateRequest request);

    ScheduleAdjustmentResponse submit(ScheduleAdjustmentSubmitRequest request);

    ScheduleAdjustmentResponse submitForCurrentInstructor(String username, ScheduleAdjustmentSubmitRequest request);

    List<ScheduleAdjustmentResponse> searchAdmin(String status, UUID courseClassId, UUID instructorId);

    List<ScheduleAdjustmentResponse> getByInstructor(UUID instructorId);

    List<ScheduleAdjustmentResponse> getCurrentInstructorRequests(String username);

    ScheduleAdjustmentResponse approve(UUID requestId, ScheduleAdjustmentReviewRequest request);

    ScheduleAdjustmentResponse reject(UUID requestId, ScheduleAdjustmentReviewRequest request);

    ScheduleAdjustmentResponse returnToInstructor(UUID requestId, ScheduleAdjustmentReviewRequest request);
}

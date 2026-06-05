package com.quanlydaotao.backend.scheduleadjustment.service;

import com.quanlydaotao.backend.scheduleadjustment.dto.ScheduleAdjustmentSuggestionRequest;
import com.quanlydaotao.backend.scheduleadjustment.dto.ScheduleAdjustmentSuggestionResponse;

public interface ScheduleAdjustmentSuggestionService {
    ScheduleAdjustmentSuggestionResponse suggest(ScheduleAdjustmentSuggestionRequest request);

    ScheduleAdjustmentSuggestionResponse suggestForCurrentInstructor(String username, ScheduleAdjustmentSuggestionRequest request);
}

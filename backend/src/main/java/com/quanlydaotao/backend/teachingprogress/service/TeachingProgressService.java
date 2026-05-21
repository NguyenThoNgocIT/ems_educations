package com.quanlydaotao.backend.teachingprogress.service;

import com.quanlydaotao.backend.teachingprogress.dto.TeachingProgressLogRequest;
import com.quanlydaotao.backend.teachingprogress.dto.TeachingProgressLogResponse;
import com.quanlydaotao.backend.teachingprogress.dto.TeachingProgressSummaryResponse;

import java.util.List;
import java.util.UUID;

public interface TeachingProgressService {
    TeachingProgressLogResponse logSession(TeachingProgressLogRequest request);

    List<TeachingProgressLogResponse> getLogs(UUID courseClassId);

    TeachingProgressSummaryResponse getSummary(UUID courseClassId);
}
